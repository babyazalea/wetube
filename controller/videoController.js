import routes from "../routes";
import Video from "../models/Video";

//아래의 render 함수는 자동으로 views 폴더에서 파일명과 확장자(pug)가 일치하는 파일을 찾아 렌더링 함.

//render 함수의 첫번째 인자는 각 routes의 이름이고 두번째 인자는 pageTitle로 선언해 각 페이지마다 다른 값을 전달한다
//JavaScript는 default 상태로 기다리지 않는다. 그러므로 async 메소드를 이용하여 로딩이 필요한 구간을 정해준다
export const home = async (req, res) => {
  // error가 발생할 경우 default로 잡아내지 못한다. try & catch를 사용해서 error를 잡아낸다.
  // tyr에는 해야할 일, catch에는 error arg를 사용하여 error를 감지하고 에러가 발생했을 경우 빈 array(배열) 데이터를 render한다.
  try {
    // Video 모델과 같은 비디오 데이터를 모두 표시함
    // await 키워드는 async를 쓰지 않으면 쓸 수 없음
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};
export const search = (req, res) => {
  // const searchingBy = req.query.term;
  // query에 저장된 검색어를 request
  const {
    query: { term: searchingBy }
  } = req;
  //searchingBy : searchingBy ---> searchingBy
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = (req, res) => {
  const {
    body: { file, title, description }
  } = req;
  res.redirect(routes.videoDetail(312312));
};

export const videoDetail = (req, res) =>
  res.render("videoDetail", { pageTitle: "Video Detail" });

export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });

export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
