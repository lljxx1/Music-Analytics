const sqlite3 = require("sqlite3");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const bplistParser = require("bplist-parser");
// const { chunk } = require("./util");
const fs = require("fs");
// const { getSQLite } = require('../../../sqlite')

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
      mode: sqlite3.OPEN_READONLY
    },
  });
  // await sequelize.query("PRAGMA journal_mode = WAL");
  const songRows = await sequelize.query(
    "select * from song_info where song_id in (" + songIds.join(",") + ")",
    { type: QueryTypes.SELECT }
  );
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

export async function getXiamiSongFromMac(opts) {
  const data = await getXiamiSongIdsByMacAVFS(opts.favsfile);
  const formattedSongs = await getXiamiSongsDataByMac(data, opts);
  return formattedSongs
}

// module.export = {
//   getXiamiSongIdsByMacAVFS: getXiamiSongIdsByMacAVFS,
//   getXiamiSongsDataByMac,
//   getXiamiSongFromMac
// };
