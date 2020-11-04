
const express = require("express");
const cors = require("cors");
const app = express();
const API = require('./index.js');
const axios = require("axios");
// import API from './index'

// const API = {}

app.use(cors());
console.log("process.versions", require("./index.js"));

app.get("/versions", async (req, res) => {
    res.json({
        versions: process.versions, 
        API
    });
});

app.get("/api/find/source", async (req, res) => {
    try {
        res.json(API.findSources());
    } catch(e) {
        res.send(e.toString())
    }
});

app.get("/api/import", async (req, res) => {
    try {
        const rows = await API.importSource(req.query)
        res.json({
            state: rows
        });
    } catch (e) {
        res.json({
            error: 1,
            msg: e.toString()
        });
    }
});

app.get("/proxy/http/get", async (req, res) => {
  try {
    const callData = await axios.get(req.query.url);
    res.json({
        response: callData.data,
    });
  } catch (e) {
    res.json({
      error: 1,
      msg: e.toString(),
    });
  }
});
;

app.get("/api/song/query", async (req, res) => {
    res.json(await API.listSongs(req.query));
});

export default app;