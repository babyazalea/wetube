import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

//express를 import해서 app 변수로 만듬
const app = express();

//helmet middleWare. 어플리케이션의 보안을 강화.
app.use(helmet());
//view engine으로 pug 사용. pug/express는 view 파일들의 위치에 관한 기본 설정으이 /views(폴더)로 되어 있음.
app.set("view engine", "pug");

// 주어진 directory에서 file을 전달하는 새로운 middleware function
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

//쿠키를 전달받아서 사용할 수 있도록 만들어주는 middleWare. 사용자 인증 같은 곳에서 쿠키를 검사할 때 사용.
app.use(cookieParser());

//사용자가 웹사이트로 전달하는 정보들을 검사하는 middleWare. request 정보에서 form이나 json 형태로 된 body를 검사함.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//morgan middleWare. 어플리케이션에서 발생하는 모든 일들을 logging.
app.use(morgan("dev"));

//local 변수를 global 변수로 사용하도록 만들어주는 middleWare
app.use(localsMiddleware);

//이 app에서 사용될 3개의 router.
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
