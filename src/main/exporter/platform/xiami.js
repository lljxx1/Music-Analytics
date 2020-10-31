const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const isWindows = process.platform == "win32";
const userName = require("os").userInfo().username;
const ini = require("ini");
const sqlite3 = require("sqlite3");
const { getXiamiSongFromMac } = require('./xiami_helpers')

console.log("userName", userName);

const os = require("os");
console.log("userName", userName);
const homeDir = os.homedir() || `C:\\Users\\${userName}`;

let files = [];
if (isWindows) {
  files.push([
    `${homeDir}\\AppData\\Roaming\\Xiami\\xiami_info.ini`,
    `${homeDir}\\AppData\\Roaming\\Xiami\\Xiami.db`,
  ]);
} else {
  const baseDir = `${homeDir}/Library/Application Support/com.xiami.macclient`
  const filePairs = []
  filePairs.push(`${baseDir}/DataBase/Music.sqlite`);
  if (fs.existsSync(baseDir)) {
    const dbDir = `${baseDir}/DataBase`;
    const avsAll = `${baseDir}/AVFSStorage`;
    const avfsDirs = fs
      .readdirSync(avsAll)
      .filter((_) => _.indexOf("favorite.songid@") > -1);
    if(avfsDirs.length) {
      console.log('fond', avfsDirs[0])
      filePairs.push(`${avsAll}/${avfsDirs[0]}/avfs.sqlite`);
    }
  }
  files.push(filePairs);
  console.log("files", files);
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

class Xiami {
  constructor() {
    this.type = "xiami";
    this.name = "虾米音乐";
    this.existsFiles = [];
  }

  isExists() {
    const existsFiles = files.filter((_) => {
      if (typeof _ == "string") {
        return fs.existsSync(_);
      } else {
        return _.filter((p) => fs.existsSync(p)).length == _.length;
      }
    });
    console.log("existsFiles", existsFiles);
    if (existsFiles.length == 0) {
      return null;
    }
    this.existsFiles = existsFiles;
    const out = {
      existsFiles: existsFiles[0],
      type: this.type,
      name: this.name,
    };
    if (!isWindows) {
      out.tip = '点击【我的收藏】 > 【随机播放】后再导入'
    }
    return out;
  }

  getCollectIds(xiamiConfigDatabase) {
    xiamiConfigDatabase = xiamiConfigDatabase || this.existsFiles[0][0];
    console.log("xiamiConfigDatabase", xiamiConfigDatabase);
    const configStr = fs.readFileSync(xiamiConfigDatabase, "utf-8");
    const config = ini.parse(configStr);
    const userId = config.xiami.USER_ID;
    const mapping = config.xiami[userId];
    const key = `${userId} = ${mapping};`;
    const lines = configStr.split("\n").filter((_) => _.indexOf(key) > -1);
    if (lines.length) {
      const songIds = lines[0]
        .replace(key, "")
        .split(",")
        .map((_) => _.trim())
        .filter((_) => !isNaN(parseInt(_)));
      return songIds;
    }
    return [];
  }

  getDebug() {
    const debugInfo = {};
    debugInfo.env = {
      APPDATA: process.env.APPDATA,
      USERPROFILE: process.env.USERPROFILE,
      HOME: process.env.HOME,
      platform: process.platform,
      uinfo: os.userInfo(),
    };
    debugInfo.checkFiles = files;
    debugInfo.type = this.type;
    return debugInfo;
  }

  async export(xiamiDatabase) {
    if (isWindows) {
      return await this.exportFromWindows();
    }
    const macConfig = {
      favsfile: this.existsFiles[0][1],
      dbFile: this.existsFiles[0][0],
      // skipCheck: true
    };
    console.log("macConfig", macConfig);
    return await getXiamiSongFromMac(macConfig);
  }

  async exportFromWindows(xiamiDatabase) {
    xiamiDatabase = xiamiDatabase || this.existsFiles[0][1];
    const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: xiamiDatabase,
      dialectOptions: {
        // mode: sqlite3.OPEN_READONLY
      },
    });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const songIds = this.getCollectIds();
    console.log("found song", songIds.length);
    // fs.writeFileSync("ids.json", JSON.stringify(songIds, null, 2));
    const songRows = await sequelize.query(
      "select * from song_info where song_id in (" + songIds.join(",") + ")",
      { type: QueryTypes.SELECT }
    );

    const PlaylistItem = sequelize.define(
      "list_items",
      {
        item_id: Sequelize.STRING,
        item_type: Sequelize.INTEGER,
        list_id: Sequelize.STRING,
        list_type: Sequelize.INTEGER,
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
    PlaylistItem.removeAttribute("id");
    const percentTotal = (songIds.length - songRows.length) / songIds.length * 100
    if (percentTotal > 5) {
      const stepItems = chunk(songIds, 300);
      try {
        await PlaylistItem.destroy({
          where: {},
          truncate: true,
        });
      } catch (e) {
        console.log(e);
      }
      for (let index = 0; index < stepItems.length; index++) {
        const newIds = stepItems[index];
        console.log("insert", newIds.length);
        try {
          await PlaylistItem.bulkCreate(
            newIds.map((_) => {
              return {
                item_id: _,
                item_type: 1,
                list_id: "main",
                list_type: 1,
              };
            }),
            { ignoreDuplicates: true }
          );
        } catch (e) {
          console.log(e);
        }
      }
      console.log("not found info");
      throw Error(
        `请重启虾米音乐，直到能点开【当前播放列表】后再尝试导入 目前本地歌曲信息库有${songRows.length}首，收藏${songIds.length}首`
      );
    }

    const orderedSongs = songIds
      .map((_) => {
        return songRows.filter((p) => p.song_id == _)[0];
      })
      .filter((_) => _);

    const formattedSongs = orderedSongs.map((_) => {
      return {
        type: "xiami",
        song_id: _.song_id,
        song_name: _.song_name,
        album_name: _.album_name,
        artist_name: _.singers,
        album_logo: _.album_logo,
        artist_logo: _.artistLogo,
      };
    });
    return formattedSongs;
  }
}

export default Xiami;

// (async () => {
//   const nete = new Xiami();
//   const has = nete.isExists();
//   if (has) {
//     const results = await nete.export();
//     console.log("results", results.length);
//   }
// })();
