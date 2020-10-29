// const Netease = require("./platform/netease");
import Netease from './platform/netease'
import Xiami from './platform/xiami'

const { Song, sequelize } = require("./databse");
const { QueryTypes } = require("sequelize");


export function findSources() {
  const sources = [new Netease(), new Xiami()];
  const exists = [];
  const debugInfos = [];
  for (let index = 0; index < sources.length; index++) {
    const source = sources[index];
    const has = source.isExists();
    if (has) {
      exists.push(has);
    } else {
      
    }

    if(source.getDebug) {
      debugInfos.push(source.getDebug())
    }
  }
  return {
    rows: exists,
    debugInfos: debugInfos
  };
}

function getFinder(type) {
  if (type == "cloudmusic") {
    return new Netease();
  }
  if (type == "xiami") {
    return new Xiami();
  }
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export async function importSource(typeDef) {
  console.log("typeDef", typeDef);
  const driver = getFinder(typeDef.type);
  driver.isExists();
  // console.log(driver);
  const allSongs = await driver.export();
  const stepItems = chunk(allSongs, 300);
  try {
    await Song.sync({ alter: true });
  } catch (e) {
    console.log(e)
  }
  let imported = 0;
  for (let index = 0; index < stepItems.length; index++) {
    const songs = stepItems[index];
    console.log("insert", songs.length);
    try {
      await Song.bulkCreate(songs, { ignoreDuplicates: true });
      imported += songs.length
    } catch (e) {
      console.log(e);
    }
  }
  console.log("importSource", allSongs.length, "imported", imported);
  return {
    totalSong: allSongs.length,
    imported: imported,
  };
}

export async function listSongs(query = {}) {
  console.log('query', query)
  if(query.dsl) {
    
  }
  
  if(query.rawSql) {
    let songRows = await sequelize.query(query.rawSql, {
      type: QueryTypes.SELECT,
    });
    console.log('query', query.rawSql)
    return songRows
  }

  query.dsl = query.dsl ? JSON.parse(query.dsl) : {};
  query.dsl.raw = query.dsl.raw || true;
  console.log("query.dsl", query.dsl);
  const rows = await Song.findAll(query.dsl);
  return rows;
    // console.log(rows);
}

// module.exports = {
//   findSources: findSources,
//   listSongs: listSongs,
//   importSource: importSource,
// };

// listSongs();
// const sources = findSources();
// importSource(sources[0]);
