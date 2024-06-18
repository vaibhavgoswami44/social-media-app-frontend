import postContext from "./postContext";
import PropsTypes from "prop-types";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../auth/userContext";

const PostState = (props) => {
  const [postList, setPostList] = useState([]);
  const [savedPostList, setSavedPostList] = useState([]);
  const { userDetails, setIsLoggedIn } = useContext(userContext);
  const navigate = useNavigate();
  const host = import.meta.env.VITE_HOST;
  //get user posts
  const getUserPosts = async (a) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(
        `${host}/api/post/getPosts?userName=${a.userName}&b=${a.pageNumber}`,
        {
          credentials: "include",
          headers: headersList,
          method: "GET",
        },
      );

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.accountType && response.accountType === "private") {
        return { accountType: "private" };
      }

      if (response.status || response.morePost) {
        setPostList(postList.concat(response.posts));
        return response;
      } else {
        return response.status;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const getUserSavedPosts = async (a) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(
        `${host}/api/post/get-saved-post?&b=${a.pageNumber}`,
        {
          credentials: "include",
          headers: headersList,
          method: "GET",
        },
      );

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.accountType && response.accountType === "private") {
        return { accountType: "private" };
      }

      if (response.status || response.morePost) {
        setSavedPostList(savedPostList.concat(response.posts));
        return response;
      } else {
        return response.status;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const addPost = async (formData) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
      };

      const data = await fetch(`${host}/api/post/addPost`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
        body: formData,
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }
      if (response.status) {
        setPostList([response.post, ...postList]);
        toast.success(response.msg);
        navigate(`/profile/${userDetails.userName}`);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const likeDislikeOnPost = async (postID) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        postID,
      };

      const data = await fetch(`${host}/api/post/like-post`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.status) {
        return response;
      }

      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const handleComments = async ({ postID, comment }) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        postID,
        comment,
      };

      const data = await fetch(`${host}/api/post/add-comment`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.status) {
        return response;
      }

      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const savePost = async (postID) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        postid: postID,
      };

      const data = await fetch(`${host}/api/post/save-post`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.status) {
        return response;
      }
      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const deletePost = async (postID) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        postid: postID,
      };

      const data = await fetch(`${host}/api/post/delete-post`, {
        credentials: "include",
        headers: headersList,
        method: "DELETE",
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        navigate("/");
      }

      if (response.status) {
        return response;
      }
      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  return (
    <postContext.Provider
      value={{
        getUserPosts,
        addPost,
        postList,
        setPostList,
        likeDislikeOnPost,
        handleComments,
        savePost,
        getUserSavedPosts,
        savedPostList,
        setSavedPostList,
        deletePost,
      }}
    >
      {props.children}
    </postContext.Provider>
  );
};

PostState.propTypes = {
  children: PropsTypes.any,
};

export default PostState;
