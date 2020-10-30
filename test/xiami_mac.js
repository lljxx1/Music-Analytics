

const assert = require('assert');
const { getXiamiSongIdsByMacAVFS } = require('../src/main/exporter/platform/xiami_helpers.js')


describe('Xiami', function() {
    describe('Mac', function() {
      it('解析文件获取收藏歌曲ID', function() {
        (async () => {
            const data = await getXiamiSongIdsByMacAVFS('./test/fixures/mac/xiami/7.5.8/favorite.songid@3096251/avfs.sqlite');
            assert.equal(data.length, 7063);
        })();
      });
    });
});