// npm install passport passport-local
import passport from "passport";
import User from "./models/User";

// strategy: passport에게 로그인 방식을 지정해주는 method(개수 상관 없이 여러 개 쓸 수 있음)
passport.use(User.createStrategy());

// serialize: 유저 정보 암호화(id만 추출)하여 쿠키로 저장, deserialize: 암호화 후 저장된 쿠키를 개별적으로 식별하게끔 암호화를 해제(?)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
