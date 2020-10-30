const sqlite3 = require('sqlite3')
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const bplistParser = require('bplist-parser');

async function getXiamiSongIdsByMacAVFS(file) {
  const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: file,
      dialectOptions: {
        mode: sqlite3.OPEN_READONLY
      }
  });
  const data = await sequelize.query(
    "select * from AVFS_KV_TABLE where key ='ids' ",
    { type: QueryTypes.SELECT }
  );
  if(data.length) {
    throw new Error('未找到收藏数据')
  }
  try {
    let plistBuf = data[0].value
    const result = bplistParser.parseBuffer(plistBuf)
    const $objects = result[0]['$objects'];
    if ($objects) {
      const arrayData = result[0]['$objects'][1]['NS.objects'].map(_ => {
        return $objects[_.UID]
      })
      return arrayData;
    }
  } catch (e) {
    throw new Error('解析收藏数据库出错' + e.toString())
  }
}
(async () => {
  const arrayData = getXiamiSongIdsByMacAVFS('./favorite.songid@3096251/avfs.sqlite')
})();


(async () => {
    
  // const sequelize = new Sequelize("main", null, null, {
  //   dialect: "sqlite",
  //   logging: false,
  //   storage: './account/avfs_encrypt.sqlite',
  //   dialectOptions: {
  //     mode: sqlite3.OPEN_READONLY
  //   }
  // });
  //   const data = await sequelize.query(
  //       "SELECT * FROM AVFS_KV_TABLE ",
  //       { type: QueryTypes.SELECT }
  //     );
  //   console.log(data)
    // bplist.parseBuffer(data[0].response_object, function(err, result) {
    //     if (!err){

    //     }
    //       console.log(JSON.stringify(result, null, 2));
    //   });

    //   console.log(JSON.parse(fs.readFileSync('./BE17010B-3BFC-4A55-8D6E-066CB7B72EE4', 'utf-8'))['data']['data']['songs'][0])
    //   fs.writeFileSync('./data', data[0].value)
    //   console.log(data[0].value)
  })();