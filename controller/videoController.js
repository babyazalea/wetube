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

// upload 파트도 마찬가지로 get, post 방식으로 분할
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

// upload의 post 접속 방식에서 upload되는 파일의 title과 des를 받아옴
// 파일의 경로도 필요하지만, 파일을 실제로 서버 컴퓨터에 저장하는 것이 아니라, 업로드 전용서버(aws 등)에 업로드 한 후에 해당 URL을 가져올 것임. 그러므로 파일을 업로드 전용 서버에 업로드 후 해당 URL을 가져오는 과정이 필요
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description
  });
  console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  // params = routes.js에서 ':id'로 써놓은 부분
  const {
    params: { id }
  } = req;
  try {
    // mongoose로 정의한 video 모델에서 findbyId(id로 찾기) 메소드를 사용
    const video = await Video.findById(id);
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findByIdAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};
