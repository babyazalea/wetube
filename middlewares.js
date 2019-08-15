import routes from "./routes";

//local 변수를 global 변수로 사용하도록 만들어주는 middleWare
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  //request(요청)과 response(응답) 사이(middle)에 있으므로
  next();
};
