const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const isWindows = process.platform == "win32";
const userName = require("os").userInfo().username;

console.log("userName", userName);

class Xiami {
  constructor() {
    this.type = "xiami";
    this.name = "虾米音乐";
    this.existsFiles = [];
  }

  isExists() {
    let files = [];
    if (isWindows) {
      files.push([
        `C:\\Users\\${userName}\\AppData\\Roaming\\Xiami\\xiami_info.ini`,
        `C:\\Users\\${userName}\\AppData\\Roaming\\Xiami\\Xiami.db`,
      ]);
    } else {
      //   files.push(
      //     `/Users/${userName}/Library/Containers/com.netease.163music/Data/Documents/storage/sqlite_storage.sqlite3`
      //   );
    }
    const existsFiles = files.filter((_) =>
      typeof _ == "string"
        ? fs.existsSync(_)
        : _.filter((p) => fs.existsSync(p).length == _.length)
    );
    console.log("existsFiles", existsFiles);
    if (existsFiles.length == 0) {
      return null;
    }
    this.existsFiles = existsFiles;
    return {
      existsFiles: existsFiles[0],
      type: this.type,
    };
  }

  getCollectIds(xiamiConfigDatabase) {
    const configStr = fs.readFileSync(xiamiConfigDatabase, "utf-8");
    const config = ini.parse(configStr);
    const userId = config.xiami.USER_ID;
    const mapping = config.xiami[userId];
    const key = `${userId} = ${mapping};`;
    const lines = configStr.split("\n").filter((_) => _.indexOf(key) > -1);
    if (lines.length) {
      const songIds = lines[0].replace(key, "").split(",");
      return songIds;
    }
    return [];
  }

  async export() {
    const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: this.xiamiDatabase,
    });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const songIds = getXiamiCollectIds();
    console.log("found song", songIds.length);
    const songRows = await sequelize.query(
      "select * from song_info where song_id in (" + songIds.join(",") + ")",
      { type: QueryTypes.SELECT }
    );
    const formattedSongs = songRows.map((_) => {
      return {
        type: "xiami",
        song_id: _.song_id,
        song_name: _.song_name,
        album_name: _.album_name,
        artist_name: _.artist_name,
        album_logo: _.album_logo,
      };
    });
    return formattedSongs;
  }
}

(async () => {
//   const nete = new Xiami();
//   const has = nete.isExists();
//   if (has) {
    // const results = await nete.export();
    // console.log("results", results.length);
//   }
})();
