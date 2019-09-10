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
    // sort({arg:-1}) = 정렬 순서를 뒤바꿈
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};
export const search = async (req, res) => {
  // const searchingBy = req.query.term;
  // query에 저장된 검색어를 request
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    // 검색 조건을 정규 표현식(regular expression)을 이용해 정해준다. $regex는 해당 검색어를 포함하는 모든 검색 결과를 나타내주고, $option을 "i"로 정의하면 insensitive(예민하지 않음)로 변경되면서 대소문자 구별을 하지 않고 검색하게 된다
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
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
    description,
    // 현재 업로드 하는 중인 user의 id
    creator: req.user.id
  });
  // user db에 videos 항목에 추가된 비디오의 id를 추가(push)한다
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  // params = routes.js에서 ':id'로 써놓은 부분
  const {
    params: { id }
  } = req;
  try {
    // mongoose로 정의한 video 모델에서 findbyId(id로 찾기) 메소드를 사용
    // populate를 붙이면 괄호 안의 객체 전체를 불러올 수 있다(creator는 객체이다)
    const video = await Video.findById(id).populate("creator");
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
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
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
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views = video.views + 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};
