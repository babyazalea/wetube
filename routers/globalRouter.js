import express from "express";
import routes from "../routes";
import { home, search } from "../controller/videoController";
import {
  getJoin,
  logout,
  postJoin,
  postLogin,
  getLogin
} from "../controller/userController";

const globalRouter = express.Router();

globalRouter.get(routes.join, getJoin);
// join route에 post 접근 방식을 추가한다
globalRouter.post(routes.join, postJoin);

globalRouter.get(routes.login, getLogin);
// login routes에 post 접근 방식을 추가한다
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, logout);

export default globalRouter;
