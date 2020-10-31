const sqlite3 = require("sqlite3");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const bplistParser = require("bplist-parser");
const { chunk } = require("./util");
const fs = require("fs");
const { getSQLite } = require('../../../sqlite')

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
  // const db = require("better-sqlite3")(opt.dbFile);
  // db.pragma("journal_mode = WAL");
  // const row = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  // console.log(row.firstName, row.lastName, row.email);
  // return
  let sqlite = getSQLite(opt.dbFile);
  // const mo = await sqlite.query("PRAGMA journal_mode=WAL");
  // console.log("mo", mo.resultSet[0]);
  const playListItems = await sqlite.query(
    "select * from song_info where song_id in (" + songIds.join(",") + ")"
  );
  // const clearResult = await sqlite.query("delete from list_items");
  console.log(playListItems.resultSet[0]);
  // clearResult, 

  // return

  const sequelize = new Sequelize("main", null, null, {
    dialect: "sqlite",
    logging: false,
    storage: opt.dbFile,
    dialectOptions: {
      // mode: sqlite3.OPEN_READONLY
    },
  });
  // await sequelize.query("PRAGMA journal_mode = WAL");
  // songIds = songIds.reverse()
  // fs.copyFileSync(opt.dbFile, "./data.db");
  // return;
  // const songRows = await sequelize.query(
  //   "select * from song_info where song_id in (" + songIds.join(",") + ")",
  //   { type: QueryTypes.SELECT }
  // );
  // const PlaylistItem = sequelize.define(
  //   "list_items",
  //   {
  //     list_auto_id: Sequelize.INTEGER,
  //     item_id: Sequelize.INTEGER,
  //     item_type: Sequelize.INTEGER,
  //     pos_index: Sequelize.INTEGER,
  //   },
  //   {
  //     freezeTableName: true,
  //     timestamps: false,
  //     indexes: [
  //       {
  //         unique: true,
  //         fields: ["list_auto_id", "item_id", "item_type"],
  //       },
  //     ],
  //   }
  // );
  // PlaylistItem.removeAttribute("id");
  const skipCheck = opt.skipCheck || false;
  // const playItemsCount = await PlaylistItem.count();
  // console.log("now playlist", playItemsCount);

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
