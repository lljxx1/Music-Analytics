const sqlite3 = require("sqlite3");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const bplistParser = require("bplist-parser");
const { chunk } = require("./util");

async function getXiamiSongIdsByMacAVFS(file) {
  const sequelize = new Sequelize("main", null, null, {
    dialect: "sqlite",
    logging: false,
    storage: file,
    dialectOptions: {
      mode: sqlite3.OPEN_READONLY,
    },
  });
  const data = await sequelize.query(
    "select * from AVFS_KV_TABLE where key ='ids' ",
    { type: QueryTypes.SELECT }
  );
  if (data.length === 0) {
    throw new Error("未找到收藏数据");
  }
  try {
    let plistBuf = data[0].value;
    const result = bplistParser.parseBuffer(plistBuf);
    const $objects = result[0]["$objects"];
    if ($objects) {
      const arrayData = result[0]["$objects"][1]["NS.objects"].map((_) => {
        return $objects[_.UID];
      });
      return arrayData;
    }
  } catch (e) {
    throw new Error("解析收藏数据库出错" + e.toString());
  }
}

async function getXiamiSongsDataByMac(songIds, opt = {}) {
  const sequelize = new Sequelize("main", null, null, {
    dialect: "sqlite",
    logging: false,
    storage: opt.dbFile,
    dialectOptions: {
      // mode: sqlite3.OPEN_READONLY
    },
  });
  // songIds = songIds.reverse()
  const songRows = await sequelize.query(
    "select * from song_info where song_id in (" + songIds.join(",") + ")",
    { type: QueryTypes.SELECT }
  );
  const PlaylistItem = sequelize.define(
    "list_items",
    {
      list_auto_id: Sequelize.INTEGER,
      item_id: Sequelize.INTEGER,
      item_type: Sequelize.INTEGER,
      pos_index: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["list_auto_id", "item_id", "item_type"],
        },
      ],
    }
  );
  PlaylistItem.removeAttribute("id");
  const skipCheck = opt.skipCheck || false;
  const playItemsCount = await PlaylistItem.count();
  console.log("now playlist", playItemsCount);
  const percentTotal = (songIds.length - songRows.length) / songIds.length * 100
  if (percentTotal > 5 && !skipCheck) {
    let posIndex = 0;
    const stepItems = chunk(songIds, 300);
    try {
      await PlaylistItem.destroy({
        where: {},
        truncate: true,
      });
    } catch (e) {
      console.log("sync.error", e);
    }
    for (let index = 0; index < stepItems.length; index++) {
      const newIds = stepItems[index];
      console.log("insert", newIds.length);
      try {
        await PlaylistItem.bulkCreate(
          newIds.map((_) => {
            const pos = posIndex;
            posIndex++;
            return {
              item_id: _,
              item_type: 1,
              list_auto_id: 1,
              pos_index: pos,
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
      artist_logo: _.artist_avatar_url,
    };
  });
  console.log(formattedSongs.length, formattedSongs[0]);
  return formattedSongs;
}

async function getXiamiSongFromMac(opts) {
  const data = await getXiamiSongIdsByMacAVFS(opts.favsfile);
  const formattedSongs = await getXiamiSongsDataByMac(data, opts);
  return formattedSongs
}

function getXiamiMacEnv() {

}


module.exports = {
  getXiamiSongIdsByMacAVFS: getXiamiSongIdsByMacAVFS,
  getXiamiSongsDataByMac,
  getXiamiSongFromMac
};
