const axios = require("axios");
var crypto = require("crypto");

function cryptPwd(password) {
  var md5 = crypto.createHash("md5");
  return md5.update(password).digest("hex");
}


const url =
  "https://acs.m.xiami.com/h5/mtop.alimusic.music.songservice.getsongs/1.0/";

const tokenUrl =
  "https://acs.m.xiami.com/h5/mtop.alimusic.recommend.songservice.getdailysongs/1.0/?appKey=12574478&t=1560663823000&dataType=json&data=%7B%22requestStr%22%3A%22%7B%5C%22header%5C%22%3A%7B%5C%22platformId%5C%22%3A%5C%22mac%5C%22%7D%2C%5C%22model%5C%22%3A%5B%5D%7D%22%7D&api=mtop.alimusic.recommend.songservice.getdailysongs&v=1.0&type=originaljson&sign=22ad1377ee193f3e2772c17c6192b17c";


(async () => {

    //  'url'    => 'https://acs.m.xiami.com/h5/mtop.alimusic.music.songservice.getsongs/1.0/',
    //             'body'   => array(
                   
    //             ),

    const songsURL =
      "https://h5api.m.xiami.com/h5/mtop.alimusic.music.songservice.getsongs/1.0/";
    const req = await axios.get(tokenUrl);
    let token = req.headers["set-cookie"][0]
      .split("; Domain")[0]
      .replace("_m_h5_tk=", "");
   

      token = "02f0648dc66126f85c965c7c18b45a83_1604121874671";

    var appkey = "23649156";
    var t = Date.now();

    const rawData = {
          'data': {
              songIds: [3564987]
          },
        'r' : 'mtop.alimusic.music.songservice.getsongs',
    }
    var data = JSON.stringify({
      requestStr: JSON.stringify({
        header: {
          platformId: "h5",
          callId: 1604116233053,
          appVersion: 1000000,
          resolution: "852*870",
        },
        model: rawData,
      }),
    });

    var signStr = `${token}${t}${appkey}${data}`;
    var sign = cryptPwd(signStr);
    var reqBody = {
      jsv: "2.4.0",
      appKey: appkey,
      t: t,
      dataType: "json",
      data: data,
      api: rawData["r"],
      v: "1.0",
      type: "originaljsonp",
      dataType: 'originaljsonp',
      closeToast: true,
      callback: 'mtopjsonp8',
      sign: sign,
    };
    //  const fReq = await axios.get(songsURL, {
    //    params: reqBody,
    //  });
    const qs = require('querystring')
    console.log(songsURL+'?'+qs.stringify(reqBody));
})();