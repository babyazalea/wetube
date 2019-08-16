import routes from "../routes";

//아래의 render 함수는 자동으로 views 폴더에서 파일명과 확장자(pug)가 일치하는 파일을 찾아 렌더링 함.

//render 함수의 첫번째 인자는 각 routes의 이름이고 두번째 인자는 pageTitle로 선언해 각 페이지마다 다른 값을 전달한다
export const users = (req, res) => res.render("users", { pageTitle: "users" });

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

// globalRouter에 추가된 post 접근 방식에서 request(요청)으로 전달 받을 값, 즉 이름과 이메일, 비밀번호와 비밀번호를 확인 받는 과정을 response(응답)로 정의한다
export const postJoin = (req, res) => {
  // app에 설치한 middleware인 bodyparser를 이용(app.js)하여 user가 입력한 4가지의 정보를 request(요청)할 수 있다
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    // 입력한 패스워드와 확인할 패스워드가 일치하지 않을 경우 http 에러 코드 400을 서버로 전송한다
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    // 패스워드를 정상적으로 입력했을 경우 home route로 redirect
    res.redirect(routes.home);
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  res.redirect(routes.home);
};

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });

export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
