// webpack을 사용하기 위해서 npm으로 webpack과 webpack-cli를 설치한 후, webpack의 환경설정을 해준다
// 추가로 node-sass도 설치
// loader 또한 각각 설치

// node module에서 path와 extract text webpack plugin(npm으로 설치)을 불러온다. 이 환경셜정 파일에서는 오로지 구식 자바스크립트만 쓰일 수 있으므로 import나 export 같은 최신 자바스크립트 문법을 사용할 수 없다.
const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

// webpack의 환경설정

// webpack의 모드
const MODE = process.env.WEBPACK_ENV;
// assets라는 이름의 폴더를 만들고 그 안에 js 파일과 css 파일의 경로를 위치
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
// 위의 assets 폴더 안의 파일들이 packing된 후 저장될 곳
const OUTPUT_DIR = path.join(__dirname, "static");

// 본격적인 환경설정 부분
const config = {
  entry: ENTRY_FILE,
  mode: MODE,
  module: {
    rules: [
      {
        // 정규표현식을 사용해서 scss 파일이 있는지 확인
        test: /\.(scss)$/,
        // 아래의 loader들은 밑에서 위로 실행됌
        use: ExtractCSS.extract([
          // 최종적인 css파일을 불러옴
          {
            loader: "css-loader"
          },
          //   브라우저 호환성 등을 해결해주는 loader(이것도 자동으로 css파일을 알맞게 변환)
          {
            loader: "postcss-loader",
            options: {
              plugin() {
                return [autoprefixer({ browers: "cover 99.5%" })];
              }
            }
          },
          //   sass나 scss파일을 받아서 css파일로 변환
          {
            loader: "sass-loader"
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("style.css")]
};

module.exports = config;
