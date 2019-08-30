import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });

//local 변수를 global 변수로 사용하도록 만들어주는 middleWare
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  // passport가 user가 담긴 object를 req에도 올려주므로 바로 사용이 가능하다
  res.locals.user = req.user || null;
  //request(요청)과 response(응답) 사이(middle)에 있으므로
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const uploadVideo = multerVideo.single("videoFile");
