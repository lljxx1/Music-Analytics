


const { getXiamiSongIdsByMacAVFS, getXiamiSongsDataByMac, getXiamiSongFromMac} = require('../src/main/exporter/platform/xiami_helpers.js')

const favFile = './test/fixures/mac/xiami/7.5.8/favorite.songid@3096251/avfs.sqlite'
const dbFile = './test/fixures/mac/xiami/7.5.8/Music.sqlite';


(async () => {
    const data = await getXiamiSongFromMac({
        favsfile: favFile,
        dbFile: dbFile,
        skipCheck: true
    });
    console.log(data.length, data[0]);
    // await getXiamiSongsDataByMac(data, dbFile);
})();