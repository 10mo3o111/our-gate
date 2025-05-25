const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring");
const path = require("path");

const indexPage = fs.readFileSync("./views/index.ejs", "utf8");
const otherPath = path.join(__dirname, "views", "other.ejs");
const otherPage = fs.readFileSync(otherPath, "utf8");
const styleNormalize = fs.readFileSync("./css/normalize.css", "utf8");
const styleCss = fs.readFileSync("./css/style.css", "utf8");
const mainJs = fs.readFileSync("./dist/main.js", "utf8");
const usersJson = fs.readFileSync("./src/mock/users.json", "utf8");

const maxNum = 10;
const filename = "ourdata.json";
let messageData = [];
readFromFile(filename);

const server = http.createServer(getFromClient);

server.listen(3000);
console.log("Start☆");

function getFromClient(req, res) {
  const urlParts = url.parse(req.url, true);

  switch (urlParts.pathname) {
    case "/":
      responseIndex(req, res);
      break;

    case "/other":
      responseOther(req, res);
      break;

    case "/css/normalize.css":
      responseStyleNormalize(req, res);
      break;

    case "/css/style.css":
      responseStyle(req, res);
      break;

    case "/dist/main.js":
      responseMainJs(req, res);
      break;

    case "/src/mock/users.json":
      responseusersJson(req, res);
      break;

    default:
      res.writeHead(404, {
        "Content-Type": "text/plain",
      });
      res.end("404 Not Found");
      break;
  }
}

function responseIndex(req, res) {
  writeIndex(req, res);
}

function responseOther(req, res) {
  if (req.method === "POST") {
    let body = "";

    req.on("data", (data) => {
      body += data;
    });

    req.on("end", () => {
      let datas = qs.parse(body);

      let username = datas.username;
      let message = datas.message;

      if (username && message) {
        let obj = { name: username, msg: message };
        messageData.unshift(obj);

        if (messageData.length > maxNum) {
          messageData.pop();
        }
        saveToFile(filename);
      }
      writeOther(req, res);
    });
  } else {
    writeOther(req, res);
  }
}

function responseStyleNormalize(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/css",
  });
  res.end(styleNormalize);
}

function responseStyle(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/css",
  });
  res.end(styleCss);
}

function responseMainJs(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/javascript",
  });
  res.end(mainJs);
}

function responseusersJson(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(usersJson);
}

function writeIndex(req, res) {
  let indexContent = ejs.render(indexPage, {
    title: "ログインページ | our-gate",
    h1: "Welcome to Our Gate",
    subTitle: "ログインしてメッセージボードを開始しましょう",
    formTitle: "ログインフォーム",
    noteFirstLine: "※現在は以下のID・パスワードでログインできます。",
    noteSecondLine: "taro（1234）、hanako（5678）、jiro（abcd）",
    formBtn: "入室する",
  });
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(indexContent);
}

function writeOther(req, res) {
  let otherContent = ejs.render(otherPage, {
    otherTitle: "私たちの掲示板 | our-gate",
    otherH1: `Welcome to Our Message Board`,
    subTitle: `ここは、私たち専用の掲示板です。`,
    boardTitle: "掲示板",
    boardFormLabel: "メッセージを入力（30文字まで）",
    boardFormBtn: `送信`,
    footerText: `OurBoard. All rights reserved.`,
    messageData: messageData,
    filename: otherPath,
  });
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(otherContent);
}

function readFromFile(fname) {
  try {
    const data = fs.readFileSync(fname, "utf8");
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("ファイル読み込みまたはJSONパースエラー:", e.message);
    return [];
  }
}

function saveToFile(fname) {
  fs.writeFile(fname, JSON.stringify(messageData, null, 2), (err) => {
    if (err) {
      console.error("ファイル書き込みエラー:", err.message);
    }
  });
}
