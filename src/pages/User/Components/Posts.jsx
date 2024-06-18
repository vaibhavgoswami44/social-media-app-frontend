import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import "../../../index.css";
import { Link, useParams } from "react-router-dom";
import userContext from "../../../Context/auth/userContext";
import defaultProfilePicture from "../../../assets/Images/default-profile-picture.png";
import Loader from "../../../Components/Loader";
import postContext from "../../../Context/post/postContext";
import { toast } from "react-toastify";
import AdminContext from "../../../Context/Admin/AdminContext";

const Posts = () => {
  const [width, setWidth] = useState("w-[30%]");
  const { userName } = useParams();
  const [showArrow, setShowArrow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const [commentModal, setCommentModal] = useState({
    show: false,
    item: null,
  });
  const { userDetails } = useContext(userContext);

  const {
    getUserPosts,
    postList,
    setPostList,
    likeDislikeOnPost,
    savePost,
    handleComments,
    deletePost,
  } = useContext(postContext);
  const [msg, setMsg] = useState(null);
  const [data, setData] = useState({
    profilePicture: null,
    userName: null,
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [postArr, setPostArr] = useState([]);
  const [comment, setComment] = useState("");
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { reportPost } = useContext(AdminContext);
  const [loader, setLoader] = useState(false);
  const [mLoader, setMLoader] = useState(false);

  const getPostList = async () => {
    let a = {
      userName,
      pageNumber: pageNumber + 1,
    };
    if (pageNumber === 0) {
      setMLoader(true);
    }
    let postData = await getUserPosts(a);
    if (pageNumber === 0) {
      setMLoader(false);
    }

    if (postData.accountType && postData.accountType === "private") {
      setMsg("Private account. follow this account to see their photos.");
    }
    if (postData) {
      setData(postData);
      setPageNumber(pageNumber + 1);
      setPostCount(postData.postCount);
    }
  };

  useEffect(() => {
    getPostList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPostList([]);
    setPostArr([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);
  useEffect(() => {
    const uniquePosts = Array.from(
      new Set(postList.map((obj) => JSON.stringify(obj))),
    ).map((str) => JSON.parse(str));

    // Sort the unique posts by createdAt, newest first
    const sortedPosts = uniquePosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // Update the state with the sorted and unique posts
    setPostArr(sortedPosts);
  }, [postList]);

  const handleClick = (index) => {
    if (window.innerWidth <= 778) {
      setWidth("w-[100%]");

      if (width != "w-[100%]") {
        setTimeout(() => {
          const temp = document.getElementById(postArr[index]._id);
          temp.scrollIntoView();
        }, 100);
      }
      setShowArrow(true);
    } else {
      setShowModal(true);
      setModalPost(index);
    }
  };

  const handleArrowClick = () => {
    setWidth("w-[30%]");
    setShowArrow(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLike = async (post, index) => {
    const data = await likeDislikeOnPost(post._id);

    if (data) {
      const tempArr = [...postArr];

      tempArr[index].postLiked = data.like;
      tempArr[index].likes = data.like
        ? tempArr[index].likes + 1
        : tempArr[index].likes - 1;

      setPostArr([...tempArr]);
    }
  };

  const handleComment = async (index) => {
    const post = postArr[index];
    const data = await handleComments({ postID: post._id, comment });

    if (data) {
      const tempArr = [...postArr];
      tempArr[index].comment = [data.comment, ...tempArr[index].comment];

      setPostArr([...tempArr]);
    }
  };

  const handleEnterKey = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleComment(index);
    }
  };

  const handleSavePost = async (item) => {
    const post = postArr[item];
    const data = await savePost(post._id);
    if (data) {
      const tempArr = [...postArr];
      tempArr[item].postSaved = data.save;
      setPostArr([...tempArr]);
    }
  };

  const showCommentModal = (index) => {
    if (window.innerWidth <= 778) {
      setCommentModal({ show: true, item: index });
    }
  };
  const deleteUserPost = async (index) => {
    const tempPost = postArr[index];
    setLoader(true);
    const data = await deletePost(tempPost._id);
    setLoader(false);
    if (data && data.status) {
      setShowDeletePostModal(false);
      toast.success(data.msg);
      const tempArr = [...postArr];
      tempArr.splice(index, 1);
      setPostArr([...tempArr]);
    }
  };

  const deleteUserPostModal = (index) => {
    setModalPost(index);
    setShowDeletePostModal(true);
  };

  const reportUserPost = async (index) => {
    const post = postArr[index];
    setLoader(true);
    await reportPost({ postID: post._id, reason: reportReason });
    setLoader(false);
    setShowReportModal(false);
    setReportReason("");
    setModalPost("");
  };
  const handleReport = (index) => {
    setModalPost(index);
    setShowReportModal(true);
    setShowModal(false);
  };
  useEffect(() => {
    const clenUp = () => {
      setPostArr([]);
      setComment("");
      setPostList([]);
    };
    return clenUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {postArr.length === 0 && (
        <>
          {mLoader ? (
            <div className="flex w-full items-center justify-center">
              <Loader width={"w-[30px] "} />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              No posts
            </div>
          )}
        </>
      )}

      {showReportModal && (
        <div className="fixed inset-0 left-0  top-0 z-[999]  h-[100vh] w-screen  overflow-y-auto ">
          <div
            onClick={() => setShowReportModal(false)}
            className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="flex min-h-screen min-w-[100vw] items-center justify-center  ">
            <div className="min-h[10vh] z-[999] flex min-w-[10vw] flex-col bg-white p-10">
              <span className="self-center justify-self-center">
                Are You sure you want to Report this post?
              </span>
              <div className="m-2  flex w-full flex-col items-center justify-center border-t p-2">
                <span className="self-center justify-self-center">
                  Select Reason
                </span>
                <select
                  className="m-2 p-2"
                  onChange={(e) => {
                    setReportReason(e.target.value);
                  }}
                >
                  <option value={"Misinformation/Fake News"}>
                    Misinformation/Fake News
                  </option>
                  <option value={"Harassment/Bullying"}>
                    Harassment/Bullying
                  </option>
                  <option value={"Violence/Threats"}>Violence/Threats</option>
                  <option value={"Spam/Scam"}>Spam/Scam</option>
                  <option value={"Privacy Violation"}>Privacy Violation</option>
                </select>
                <input
                  type="text"
                  className="m-1 border p-2 focus:outline-none"
                  placeholder="Other Reason"
                  onChange={(e) => {
                    setReportReason(e.target.value);
                  }}
                />
              </div>
              <div className="mt-3 flex w-full items-end justify-end">
                <button
                  className="mx-2 bg-blue-700 p-2 text-white"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="mx-2 bg-[red] p-2 text-white"
                  onClick={() => reportUserPost(modalPost)}
                >
                  {loader ? (
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[30px] "} />
                    </div>
                  ) : (
                    "   Report Post"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setShowReportModal(false)}
            className="fixed inset-0 bg-black opacity-70"
          ></div>
        </div>
      )}
      {showDeletePostModal && (
        <div className="fixed inset-0 left-0  top-0 z-[999]  h-[100vh] w-screen  overflow-y-auto ">
          <div
            onClick={() => setShowDeletePostModal(false)}
            className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="flex min-h-screen min-w-[100vw] items-center justify-center  ">
            <div className="min-h[10vh] z-[999] flex min-w-[10vw] flex-col bg-white p-10">
              <span className="self-center justify-self-center">
                Are You sure you want to delete this post?
              </span>
              <div className="mt-3 flex w-full items-end justify-end">
                <button
                  className="mx-2 bg-blue-700 p-2 text-white"
                  onClick={() => setShowDeletePostModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="mx-2 bg-[red] p-2 text-white"
                  onClick={() => deleteUserPost(modalPost)}
                >
                  {loader ? (
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[30px] "} />
                    </div>
                  ) : (
                    "  Delete Post"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setShowDeletePostModal(false)}
            className="fixed inset-0 bg-black opacity-70"
          ></div>
        </div>
      )}

      {commentModal.show && (
        <div className="fixed inset-0 left-0  top-0 z-[999]  h-[100vh] w-screen  overflow-y-auto ">
          <div
            onClick={() => {
              setCommentModal({ show: false, item: null });
            }}
            className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div className="flex h-full w-[100vw]   items-center justify-center">
            <div className="z-[999] flex h-[60%] w-full flex-row rounded-md bg-black md:w-[50%] xl:h-[80%] ">
              <div className="relative flex h-full w-full  flex-col rounded-r-md  bg-white md:w-[60%] xl:h-full xl:w-[50%]">
                {/* comments array TO DO */}
                <div className="scrollbar-hide h-[100%] overflow-y-auto xl:h-[60%]">
                  {postArr[commentModal.item].comment.length === 0 && (
                    <div className="flex h-full w-full items-center justify-center">
                      No Comments
                    </div>
                  )}
                  {postArr[commentModal.item].comment.map((e, i) => {
                    return (
                      <Link
                        to={`/profile/${e.userName}`}
                        key={i}
                        className="relative"
                      >
                        <div className=" flex w-full  items-center   py-5 pl-3 ">
                          <img
                            className=" h-[30px] w-[30px] rounded-[50%]"
                            src={e.profile ? e.profile : defaultProfilePicture}
                            style={{ objectFit: "contain" }}
                          />
                          <span className="ml-2 cursor-pointer text-sm font-bold">
                            {e.userName}
                          </span>
                          <span className="ml-2 cursor-pointer text-sm">
                            {e.comment}
                          </span>
                        </div>
                        <span className="absolute bottom-0 left-14 text-sm">
                          {e.createdAt}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="absolute bottom-0 flex w-full border-t border-gray-200 bg-white">
                  <input
                    className=" m-3 focus:outline-none"
                    placeholder="Add a comment..."
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => handleEnterKey(e, commentModal.item)}
                  />
                  <div>
                    <button
                      onClick={() => {
                        handleComment(commentModal.item);
                      }}
                      className="  absolute right-2 m-3 cursor-pointer font-bold text-blue-500"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setCommentModal({ show: false, item: null })}
            className="fixed inset-0 bg-black opacity-70"
          ></div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 left-0  top-0 z-[999] hidden h-[100vh] w-screen  overflow-y-auto md:block">
          <div
            onClick={closeModal}
            className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          {modalPost > 0 && (
            <div
              onClick={() => setModalPost(modalPost - 1)}
              className="absolute left-5 top-[50%] z-[999] cursor-pointer"
            >
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white hover:bg-gray-200">
                <i className="fa-solid fa-chevron-left"></i>
              </div>
            </div>
          )}
          {!(modalPost === postArr.length - 1) && window.innerWidth > 778 && (
            <div
              onClick={() => setModalPost(modalPost + 1)}
              className=" absolute right-5 top-[50%] z-[999] cursor-pointer"
            >
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white hover:bg-gray-200">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          )}
          <div className="flex h-full w-full   items-center justify-center">
            <div className="z-[999] flex  h-[60%] w-[80%] flex-row rounded-md bg-black xl:h-[80%] ">
              <div
                onDoubleClick={() => {
                  handleLike(postArr[modalPost], modalPost);
                }}
                className="cursor-pointer rounded-3xl p-3 md:w-[40%] xl:w-[50%] "
              >
                <img
                  className="h-full w-full"
                  src={postArr[modalPost].image}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="relative flex flex-col   rounded-r-md  bg-white md:w-[60%] xl:h-full xl:w-[50%]">
                <div className=" flex w-full  items-center border-b border-gray-200  py-5 pl-3 ">
                  <img
                    className=" h-[30px] w-[30px] rounded-[50%]"
                    src={
                      data.profilePicture
                        ? userDetails.profilePicture
                        : defaultProfilePicture
                    }
                    style={{ objectFit: "contain" }}
                  />
                  <span className="ml-2 cursor-pointer text-sm font-bold">
                    {data.userName}
                  </span>

                  {/* TO DO */}

                  {/* {!(data.userName === userDetails.userName) && (
                    <>
                      <span className="ml-2 h-[5px] w-[5px] rounded-[50%] bg-black"></span>
                      <span className="ml-2 cursor-pointer text-sm font-bold text-blue-700">
                        Follow
                      </span>
                    </>
                  )} */}
                  <div className="absolute right-2 ">
                    {data.userName === userDetails.userName ? (
                      <i
                        onClick={() => {
                          setShowDeletePostModal(true);
                          setShowModal(false);
                        }}
                        title="Delete Post"
                        className="fa-solid fa-trash cursor-pointer text-[#ff3434]"
                      ></i>
                    ) : (
                      <span
                        onClick={() => {
                          setShowReportModal(true);
                          setShowModal(false);
                        }}
                        className="cursor-pointer border p-1"
                      >
                        Report Post
                      </span>
                    )}
                  </div>
                </div>

                <div className="scrollbar-hide h-[50%] overflow-y-auto border-b border-gray-200 xl:h-[60%]">
                  {postArr[modalPost].comment.length === 0 && (
                    <div className="flex h-full w-full items-center justify-center">
                      No Comments
                    </div>
                  )}
                  {postArr[modalPost].comment.map((e, i) => {
                    return (
                      <Link
                        to={`/profile/${e.userName}`}
                        key={i}
                        className="relative"
                      >
                        <div className=" flex w-full  items-center   py-5 pl-3 ">
                          <img
                            className=" h-[30px] w-[30px] rounded-[50%]"
                            src={e.profile ? e.profile : defaultProfilePicture}
                            style={{ objectFit: "contain" }}
                          />
                          <span className="ml-2 cursor-pointer text-sm font-bold">
                            {e.userName}
                          </span>
                          <span className="ml-2 cursor-pointer text-sm">
                            {e.comment}
                          </span>
                        </div>
                        <span className="absolute bottom-0 left-14 text-sm">
                          {e.createdAt}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div>
                  <div className=" pb-2">
                    <div className="mb-2 mt-5 flex w-full">
                      <div className="ml-3 flex w-[90%]">
                        <i
                          onClick={() => {
                            handleLike(postArr[modalPost], modalPost);
                          }}
                          className={`${postArr[modalPost].postLiked ? "fa-solid text-[red]" : "fa-regular"} fa-heart mx-1 cursor-pointer`}
                        ></i>
                        <i className="fa-regular fa-paper-plane mx-1"></i>
                      </div>
                      <div className="flex w-[10%]">
                        <i
                          onClick={() => handleSavePost(modalPost)}
                          className={`${postArr[modalPost].postSaved ? "fa-solid" : "fa-regular"} fa-bookmark cursor-pointer`}
                        ></i>
                      </div>
                    </div>
                    <div className="ml-3 flex">
                      <span className="font-bold">
                        {postArr[modalPost].likes} &nbsp; Likes
                      </span>
                    </div>
                    <div className="ml-3 flex">
                      <span className="font-bold">
                        {postArr[modalPost].caption}
                      </span>
                    </div>
                    <div className="ml-3">
                      <span className="text-xs text-gray-500">
                        {postArr[modalPost].createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 flex w-full border-t border-gray-200">
                  <input
                    className=" m-2 focus:outline-none"
                    placeholder="Add a comment..."
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => handleEnterKey(e, modalPost)}
                  />
                  <div>
                    <button
                      onClick={() => {
                        handleComment(modalPost);
                      }}
                      className="  absolute right-2 m-3 cursor-pointer font-bold text-blue-500"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black opacity-70"
          ></div>
        </div>
      )}
      {showArrow && (
        <div className=" sticky left-4 top-[8vh] z-[10] flex w-full bg-white">
          <div
            onClick={handleArrowClick}
            className="z-50 flex w-[50%] justify-start p-3"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div className="absolute flex w-full justify-center p-3">
            <div>Posts</div>
          </div>
        </div>
      )}

      {msg ? (
        <div className="w-full items-center justify-center py-4">{msg}</div>
      ) : (
        <InfiniteScroll
          dataLength={postArr.length}
          next={getPostList}
          hasMore={postArr.length < postCount}
          loader={
            <div className="flex w-full items-center justify-center">
              <Loader width={"w-[30px] "} />
            </div>
          }
          className="flex flex-wrap "
        >
          {postArr.map((e, i) => (
            <Post
              handleClick={handleClick}
              width={width}
              key={i}
              index={i}
              post={e}
              handleLike={handleLike}
              handleComment={handleComment}
              handleSavePost={handleSavePost}
              showCommentModal={showCommentModal}
              deleteUserPostModal={deleteUserPostModal}
              data={data}
              handleReport={handleReport}
              type={true}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Posts;
