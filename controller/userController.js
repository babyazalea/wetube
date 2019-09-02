import passport from "passport";
import routes from "../routes";
import User from "../models/User";

//아래의 render 함수는 자동으로 views 폴더에서 파일명과 확장자(pug)가 일치하는 파일을 찾아 렌더링 함.

//render 함수의 첫번째 인자는 각 routes의 이름이고 두번째 인자는 pageTitle로 선언해 각 페이지마다 다른 값을 전달한다
export const users = (req, res) => res.render("users", { pageTitle: "users" });

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

// globalRouter에 추가된 post 접근 방식에서 request(요청)으로 전달 받을 값, 즉 이름과 이메일, 비밀번호와 비밀번호를 확인 받는 과정을 response(응답)로 정의한다
// next arg의 경우 req로 name, email, password 등을 전달 받아서 next로 넘겨준다
export const postJoin = async (req, res, next) => {
  // app에 설치한 middleware인 bodyparser를 이용(app.js)하여 user가 입력한 4가지의 정보를 request(요청)할 수 있다
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    // 입력한 패스워드와 확인할 패스워드가 일치하지 않을 경우 http 에러 코드 400을 서버로 전송한다
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

// passport.autenticate method는 username, password가 필요하다
// 그냥 login : user가 username과 password 입력한 값을 넘겨 받아 사용한다
// join 후 login : postJoin에서 이 값을 넘겨 받는다
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

// github login function : passport.js에 명시한 GithubStrategy을 실행한다
export const githubLogin = passport.authenticate("github");

// 위의 github login fucntion이 끝난 후 passport.js에 명시한 githubLoginCallback가 실행된다
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    // 해당 깃헙 이메일과 동일한 이메일로 가입된 아이디가 있는지 확인
    const user = await User.findOne({ email });
    if (user) {
      // 동일한 이메일이 발견됐을 경우
      user.gihubId = id;
      user.save();
      return cb(null, user);
    }
    // 동일한 아이디가 없을 경우 새로운 유저로 추가
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// 정상적으로 github 로그인이 되었다면 home으로 돌려보낸다
export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // 동일한 이메일이 발견됐을 경우
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      // 파일이 존재하는가? 존재한다면 해당 아바타 파일의 경로를(new one), 아니라면 이전 아바타 파일의 경로를 그대로 써라
      avatarUrl: file ? file.path : req.user.avatarUrl
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    // 변경하려는 비밀번호가 인증(verify)되지 않으면
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
