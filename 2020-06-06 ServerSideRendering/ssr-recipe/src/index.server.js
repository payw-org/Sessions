import App from "./App";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import express from "express";
import fs from "fs";
import path from "path";

// 번들링에 포함되지않은 static 파일들의 이름과 위치를 담은 Dictionary를 생성
const manifest = JSON.parse(
  fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf8")
);
const manifest_files = manifest.files;
const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key))
  .map(key => `<script src="${manifest_files[key]}"></script>`)
  .join("");

// index.html을 생성하는 func
function createPage(root) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset = "utf-8"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>ReactApp</title>
        <link href="${manifest_files["main.css"]}" rel="stylesheet"/>
      </head>
      <body>
        <noscript> You need to enableJavaScript to run the this app</noscript>
        <div id="root">
        ${root}
        </div>
        <script src="${manifest_files["runtime-main.js"]}"></script>
        ${chunks}
        <script src="${manifest_files["main.js"]}></script
      </body>
      </html>
    `;
}

const app = express();

// 서버사이드 렌더링을 처리 할 핸들러 함수입니다.
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버사이드 렌더링을 해줍니다.

  const context = {};

  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답합니다.
};

const serve = express.static(path.resolve('./build'), {
  index: false // "/" 경로에서 index.html 을 보여주지 않도록 설정
});

app.use(serve); // 순서가 중요합니다. serverRender 전에 위치해야 합니다.
app.use(serverRender);

// 5000포트로 서버를 가동합니다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});