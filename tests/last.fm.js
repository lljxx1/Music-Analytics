(async () => {
  const songs = temp1;
  for (let index = 0; index < songs.length; index++) {
    const line = songs[index];
    const csrfmiddlewaretoken = document
      .querySelector('input[name="csrfmiddlewaretoken"]')
      .getAttribute("value");
    try {
      await fetch("https://www.last.fm/user/fun00/loved", {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-newrelic-id": "UwYPV15QGwYFXFlXDgU=",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://www.last.fm/user/fun00",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          "csrfmiddlewaretoken=" +
          csrfmiddlewaretoken +
          "&action=love&track=" +
          encodeURIComponent(line[0]) +
          "&artist=" +
          encodeURIComponent(line[1]) +
          "&ajax=1",
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
    } catch (e) {}
  }
})();
