import axios from "axios";

const commentNumber = document.getElementById("jsCommentNumber");
const commentList = document.getElementById("jsCommentList");
const removeBtn = document.querySelectorAll("#jsRemoveBtn");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const removeComment = (id, target) => {
  const btnWrapper = target.parentElement;
  const removingTarget = btnWrapper.parentElement;
  commentList.removeChild(removingTarget);
  decreaseNumber();
};

const removeBtnClick = async event => {
  const target = event.target;
  const commentId = target.id;
  const response = await axios({
    url: `/api/${commentId}/comment/remove`,
    method: "POST",
    data: { commentId }
  });
  if (response.status === 200) {
    removeComment(commentId, target);
  }
  console.log(commentId);
};

const addEvent = () => {
  removeBtn.forEach(function(el) {
    const btn = el.childNodes[0];
    btn.addEventListener("click", removeBtnClick);
  });
};

function init() {
  addEvent();
}

if (removeBtn) {
  init();
}
