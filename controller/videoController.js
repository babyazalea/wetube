import { videos } from "../db";

//아래의 render 함수는 자동으로 views 폴더에서 파일명과 확장자(pug)가 일치하는 파일을 찾아 렌더링 함.

//render 함수의 첫번째 인자는 각 routes의 이름이고 두번째 인자는 pageTitle로 선언해 각 페이지마다 다른 값을 전달한다
export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const search = (req, res) => {
  // const searchingBy = req.query.term;
  const {
    query: { term: searchingBy }
  } = req;
  //searchingBy : searchingBy ---> searchingBy
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const upload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const videoDetail = (req, res) =>
  res.render("videoDetail", { pageTitle: "Video Detail" });

export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
