import PropTypes from "prop-types";
import "../../../index.css";
import { useContext } from "react";
import userContext from "../../../Context/auth/userContext";
import defaultProfilePicture from "../../../assets/Images/default-profile-picture.png";
import { Link } from "react-router-dom";

const Post = ({
  post,
  handleClick,
  index,
  width,
  handleLike,
  handleSavePost,
  showCommentModal,
  data,
  deleteUserPostModal,
  type,
  handleReport,
}) => {
  const { userDetails } = useContext(userContext);

  return (
    <div
      id={`${post._id}`}
      onClick={() => handleClick(index)}
      className={`mx-1 my-1 border border-gray-200 ${width} group relative  cursor-pointer`}
    >
      <div className="absolute inset-0  hidden h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 md:flex">
        <span className="z-[99] mx-1 font-bold text-white">
          <i
            className={`${post.postLiked ? "fa-solid text-[red]" : "fa-regular"} fa-heart mx-1`}
          ></i>
          &nbsp; {post.likes}
        </span>
        &nbsp; &nbsp;
        <span className="z-[99] mx-1 font-bold text-white">
          <i className="fa-solid fa-comment "></i>
          &nbsp; {post.comment.length}
        </span>
        {/* Modal Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div
        onDoubleClick={() => {
          handleLike(post, index);
        }}
        className="w-full"
      >
        {width === "w-[100%]" && window.innerWidth <= 778 && (
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
            <Link
              to={`/profile/${post.postOwner}`}
              className="ml-2 cursor-pointer text-sm font-bold"
            >
              {post.postOwner}
            </Link>

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
              {type && (
                <>
                  {data.userName === userDetails.userName && (
                    <i
                      onClick={() =>
                        deleteUserPostModal && deleteUserPostModal(index)
                      }
                      title="Delete Post"
                      className="fa-solid fa-trash cursor-pointer text-[#ff3434]"
                    ></i>
                  )}
                </>
              )}
              {type && (
                <>
                  {data.userName !== userDetails.userName && (
                    <button onClick={() => handleReport(index)}>
                      Report Post
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <img
          className="w-full"
          src={post.image}
          style={{ aspectRatio: "1/1", objectFit: "contain" }}
        />
      </div>
      {width === "w-[100%]" && window.innerWidth <= 778 && (
        <div>
          <div className="mb-2 mt-5 flex w-full">
            <div className="ml-3 flex w-[90%]">
              <i
                className={`${post.postLiked ? "fa-solid text-[red]" : "fa-regular"} fa-heart mx-1 cursor-pointer`}
                onClick={() => {
                  handleLike(post, index);
                }}
              ></i>
              <i
                className="fa-regular fa-comment mx-1"
                onClick={() => showCommentModal(index)}
              ></i>
              <i className="fa-regular fa-paper-plane mx-1"></i>
            </div>
            <div className="flex w-[10%]">
              <i
                onClick={() => handleSavePost(index)}
                className={`${post.postSaved ? "fa-solid" : "fa-regular"} fa-bookmark cursor-pointer`}
              ></i>
            </div>
          </div>
          <div className="ml-3 flex">
            <span className="font-bold"> {post.likes} &nbsp; Likes</span>
          </div>
          <div>
            <span className="ml-3 font-bold">{post.caption}</span>
          </div>
          <div className="ml-3" onClick={() => showCommentModal(index)}>
            View all comments
          </div>
          <div className="ml-3">
            <span className="text-xs text-gray-500">{post.createdAt}</span>
          </div>
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object,
  handleClick: PropTypes.func,
  handleReport: PropTypes.func,
  deleteUserPostModal: PropTypes.func,
  showCommentModal: PropTypes.func,
  handleLike: PropTypes.func,
  handleSavePost: PropTypes.func,
  index: PropTypes.number,
  width: PropTypes.string,
  data: PropTypes.any,
  type: PropTypes.any,
};

export default Post;
