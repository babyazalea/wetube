import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controller/videoController";
import {
  getJoin,
  logout,
  postJoin,
  postLogin,
  getLogin,
  githubLogin,
  postGithubLogIn
} from "../controller/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
// join route에 post 접근 방식을 추가한다
// postJoin에서 입력한 값들을 next()에 해당하는 postLogin으로 전달한다
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
// login routes에 post 접근 방식을 추가한다
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

// user가 github login 페이지 진입 시 userController의 githubLogin 함수 실행
globalRouter.get(routes.gitHub, githubLogin);
// githubLogin 함수가 정상적으로 실행되었다면 gitHubCallback route로 진입하며 github login이 진행되고, postGithubLogIn이 실행된다
globalRouter.get(
  routes.gitHubCallback,
  passport.authenticate(
    "github",
    { failureRedirect: "/login" },
    postGithubLogIn
  )
);

export default globalRouter;
