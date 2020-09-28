const sqlite3 = require('sqlite3')
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require('fs');

const sequelize = new Sequelize("main", null, null, {
    dialect: "sqlite",
    logging: false,
    storage: './avfs.sqlite',
    dialectOptions: {
      mode: sqlite3.OPEN_READONLY
    }
  });

  (async () => {

    const data = await sequelize.query(
        "select * from AVFS_KV_TABLE where key ='ids' ",
        { type: QueryTypes.SELECT }
      );
      fs.writeFileSync('./data', data[0].value)
      console.log(data[0].value)
  })();