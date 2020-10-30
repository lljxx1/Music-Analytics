
const os = require('os');

// const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const homeDir = os.homedir() || `C:\\Users\\${userName}`;
const dir = `${homeDir}\\AppData\\Local\\Netease\\CloudMusic\\Library\\webdb.dat`

let files = [];
  files.push([
    `${homeDir}\\AppData\\Roaming\\Xiami\\xiami_info.ini`,
    `${homeDir}\\AppData\\Roaming\\Xiami\\Xiami.db`,
  ]);

console.log('homeDir', files, os.userInfo())