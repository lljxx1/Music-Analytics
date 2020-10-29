const sqlite3 = require('sqlite3')
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require('fs');
const bplist = require('bplist');


  (async () => {

    
    const sequelize = new Sequelize("main", null, null, {
        dialect: "sqlite",
        logging: false,
        storage: './avfs.sqlite',
        dialectOptions: {
        mode: sqlite3.OPEN_READONLY
        }
    });

    const data = await sequelize.query(
        "select * from AVFS_KV_TABLE where key ='ids' ",
        { type: QueryTypes.SELECT }
      );
        let plistBuf = data[0].value
      bplist.parseBuffer(plistBuf, function(err, result) {
        if (!err){

        }
        //   console.log(result[0]['$objects'][1]);
      });

    //   fs.writeFileSync('./data', data[0].value)
    //   console.log(data[0].value)
  })();


(async () => {
    
  const sequelize = new Sequelize("main", null, null, {
    dialect: "sqlite",
    logging: false,
    storage: './account/avfs_encrypt.sqlite',
    dialectOptions: {
      mode: sqlite3.OPEN_READONLY
    }
  });
    const data = await sequelize.query(
        "SELECT * FROM AVFS_KV_TABLE ",
        { type: QueryTypes.SELECT }
      );
    console.log(data)

    // bplist.parseBuffer(data[0].response_object, function(err, result) {
    //     if (!err){

    //     }
    //       console.log(JSON.stringify(result, null, 2));
    //   });

    //   console.log(JSON.parse(fs.readFileSync('./BE17010B-3BFC-4A55-8D6E-066CB7B72EE4', 'utf-8'))['data']['data']['songs'][0])
    //   fs.writeFileSync('./data', data[0].value)
    //   console.log(data[0].value)
  })();