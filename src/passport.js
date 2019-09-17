// npm install passport passport-local
import passport from "passport";
// npm install passport-github
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import {
  githubLoginCallback,
  facebookLoginCallback
} from "./controller/userController";

import routes from "./routes";

// strategy: passport에게 로그인 방식을 지정해주는 method(개수 상관 없이 여러 개 쓸 수 있음)
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `https://agile-oasis-17155.herokuapp.com${routes.gitHubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://evil-puma-5.localtunnel.me${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);

// serialize: 유저 정보 암호화(id만 추출)하여 쿠키로 저장, deserialize: 암호화 후 저장된 쿠키를 개별적으로 식별하게끔 암호화를 해제(?), user 정보를 req(요청) object에 할당하여 user 정보가 필요한 모든 middleware와 route에서 해당 정보를 사용할 수 있도록 해준다
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
