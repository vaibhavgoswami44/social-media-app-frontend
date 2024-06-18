import { useEffect, useRef, useState } from "react";
import userContext from "./userContext";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomToast from "../../Components/CustomToast";
import socket from "../../Socket/Socket.js";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import { deleteToken } from "firebase/messaging";

const UserState = (props) => {
  const [userDetails, setUserDetails] = useState({
    name: null,
    username: null,
    profilePicture: null,
    passwordChangedDate: "",
  });
  const location = useLocation();
  const dummyRef = useRef();
  const [settings, setSettings] = useState(false);
  const [notification, setNotification] = useState([]);
  const [notificationLoader, setNotificationLoader] = useState([]);
  const [conversationsList, setConversationsList] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [notificationBadge, setNotificationBadge] = useState(false);
  const [accountType, setAccountType] = useState("public");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Cookies.get("token") === undefined ? false : true,
  );
  const [chatToken, setChatToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const host = import.meta.env.VITE_HOST;

  const logout = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/logout`, {
        credentials: "include",
        headers: headersList,
        method: "PUT",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        toast.success("Logged out");
        setNotification([]);
        setMessages([]);
        setChatToken(null);
        setIsLoggedIn(false);
        navigate("/");
        Cookies.remove("user");
        Cookies.remove("token");
        setUserDetails({
          name: null,
          username: null,
          profilePicture: null,
        });
        socket.emit("customDisconnect");
        deleteToken();
        return true;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const reqPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPIDKEY,
      });
      console.log("firebase token => ", token);
      return token;
    } else {
      toast.warn("Notifications blocked");
      return false;
    }
  };

  const setToken = async () => {
    try {
      const firebaseToken = await reqPermission();
      if (firebaseToken) {
        let user = JSON.parse(Cookies.get("token"));
        const headersList = {
          "Content-Type": "application/json",
          token: user.token,
        };
        const bodyContent = JSON.stringify({
          firebaseToken: firebaseToken,
        });

        const data = await fetch(`${host}/api/auth/setFirebaseToken`, {
          credentials: "include",
          headers: headersList,
          method: "PUT",
          body: bodyContent,
        });

        let response = await data.json();
        console.log(response);

        if (response.logout) {
          logout();
        }
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //check if email already exits
  const checkEmail = async (email) => {
    try {
      const headersList = {
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({
        email: email,
      });

      const data = await fetch(`${host}/api/auth/check-email`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        return response.status;
      } else {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //verify email on sign up
  const verifyEmail = async (user) => {
    try {
      const headersList = {
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        birthDay: user.bDate,
        userName: user.userName,
      });

      const data = await fetch(`${host}/api/auth/sign-up`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        return response;
      } else {
        toast.warn(response.msg[0]);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //verify otp on sign up and register user
  const registerUser = async (otp) => {
    try {
      const headersList = {
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({ otp });

      const data = await fetch(`${host}/api/auth/register-user`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        toast.success(response.msg);
        navigate("/");
        Cookies.remove("user");
        Cookies.remove("page");
        setIsLoggedIn(true);
        let user = JSON.stringify({
          userName: response.user.userName,
          name: response.user.name,
          profilePicture: response.user.profilePicture
            ? response.user.profilePicture
            : null,
        });
        let token = JSON.stringify({
          token: response.token,
        });
        setToken();
        Cookies.set("user", user, { expires: 30 });
        Cookies.set("token", token, { expires: 30 });
        setAccountType("public");
        setUserDetails({
          userName: response.user.userName,
          name: response.user.name,
          profilePicture: response.user.profilePicture
            ? response.user.profilePicture
            : null,
          token: response.token,
        });
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //login
  const login = async (user) => {
    try {
      const headersList = {
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({
        email: user.email,
        password: user.password,
      });

      const data = await fetch(`${host}/api/auth/login`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        toast.success(response.msg);
        navigate("/");
        Cookies.remove("user");
        Cookies.remove("page");
        setIsLoggedIn(true);
        let user = JSON.stringify({
          userName: response.user.userName,
          name: response.user.name,
          profilePicture: response.user.profilePicture
            ? response.user.profilePicture
            : null,
        });
        let token = JSON.stringify({
          token: response.token,
        });
        setToken();
        Cookies.set("user", user, { expires: 30 });
        Cookies.set("token", token, { expires: 30 });
        setAccountType(response.accountType);
        setUserDetails({
          userName: response.user.userName,
          passwordChangedDate: response.user.passwordChangedDate,
          name: response.name,
          profilePicture: response.user.profilePicture
            ? response.user.profilePicture
            : null,
          token: response.token,
        });
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //verifyUser
  const verifyUser = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/verify-user`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.logout) {
        logout();
      }

      if (response.status) {
        setToken();
        setNotification([]);
        getUserNotifications(1);
        Cookies.remove("user");
        Cookies.set("user", response.data, { expires: 30 });
        setAccountType(response.accountType);
        setIsLoggedIn(true);
        setUserDetails(response.data);
      } else {
        navigate("/");
        setUserDetails({
          name: null,
          username: null,
          profilePicture: null,
        });
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const getUserProfile = async (userName) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/getUserProfile/${userName}`, {
        credentials: "include",
        headers: headersList,
        method: "GET",
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
      if (response.status) {
        return response.data;
      } else {
        toast.warn(response.msg);
        return response;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const changeAccountType = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/changeAccountType`, {
        credentials: "include",
        headers: headersList,
        method: "PUT",
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
      if (response.status) {
        setAccountType(response.accountType);
      } else {
        toast.warn(response.msg);
        return response.status;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //handle follow unfollow
  const handleFollowUnfollow = async (userName) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const body = JSON.stringify({
        userName,
      });

      const data = await fetch(`${host}/api/auth/handleFollowUnfollow`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
        body: body,
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
      if (response.status) {
        return response;
      } else {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  //handle acceptFollowRequest
  const acceptFollowRequest = async (id, type) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const body = JSON.stringify({
        id,
        type,
      });

      const data = await fetch(`${host}/api/auth/acceptFollowRequest`, {
        credentials: "include",
        headers: headersList,
        method: "PUT",
        body: body,
      });

      let response = await data.json();
      console.log(response);

      if (response.logout) {
        logout();
      }
      if (response.status) {
        return true;
      } else {
        toast.warn(response.msg);
        return false;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  // get notifications
  const getUserNotifications = async (pageNumber) => {
    try {
      if (pageNumber === 1) {
        setNotificationLoader(true);
      }
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };
      const data = await fetch(
        `${host}/api/auth/notification?b=${pageNumber}`,
        {
          credentials: "include",
          headers: headersList,
          method: "GET",
        },
      );

      if (pageNumber === 1) {
        setNotificationLoader(false);
      }
      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
      if (response.status) {
        setNotification((prev) => prev.concat(response.notification));
        setNotificationCount(response.notificationCount);
        return response;
      } else {
        return response;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //mark notification seen
  const markNotificationSeen = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };
      const data = await fetch(`${host}/api/auth/markNotificationSeen`, {
        credentials: "include",
        headers: headersList,
        method: "PUT",
      });

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  //get conversations
  const getConversations = async (pageNumber) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };
      const data = await fetch(
        `${host}/api/auth/getConversations?b=${pageNumber}`,
        {
          credentials: "include",
          headers: headersList,
          method: "GET",
        },
      );

      let response = await data.json();
      console.log(response);
      if (response.logout) {
        logout();
      }
      if (response.status) {
        return response;
      } else {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const getChatToken = async (userName) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(
        `${host}/api/auth/generate-chat-token/${userName}`,
        {
          credentials: "include",
          headers: headersList,
          method: "POST",
        },
      );

      let response = await data.json();
      console.log(response);
      if (response.status) {
        setChatToken(response.chatToken);
        setMessages((prev) => prev.concat(response.messages));
        setMessagesCount(response.messagesCount);
        return response;
      } else {
        toast.warn(response.msg);
        return false;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const getChats = async (pageNumber) => {
    try {
      if (chatToken) {
        let user = JSON.parse(Cookies.get("token"));
        const headersList = {
          "Content-Type": "application/json",
          token: user.token,
          chattoken: chatToken,
        };

        const data = await fetch(
          `${host}/api/auth/get-chats/?b=${pageNumber}`,
          {
            credentials: "include",
            headers: headersList,
            method: "GET",
          },
        );

        let response = await data.json();
        console.log(response);
        if (response.status) {
          return response;
        } else {
          toast.error("Internal server error");
          return false;
        }
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const markMessagesSeen = async () => {
    try {
      if (chatToken) {
        let user = JSON.parse(Cookies.get("token"));
        const headersList = {
          "Content-Type": "application/json",
          token: user.token,
          chattoken: chatToken,
        };

        const data = await fetch(`${host}/api/auth/mark-messages-seen/`, {
          credentials: "include",
          headers: headersList,
          method: "PUT",
        });

        let response = await data.json();
        console.log(response);
        if (response.status) {
          return response;
        } else {
          toast.error("Internal server error");
          return false;
        }
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const verifyUserPassword = async (password) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const bodyContent = JSON.stringify({
        password: password,
      });

      const data = await fetch(`${host}/api/auth/verify-user-password`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        return response;
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const updateUserEmailPassword = async ({ email, password }) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const bodyContent = JSON.stringify({
        password: password ? password : null,
        email: email ? email : null,
      });

      const data = await fetch(`${host}/api/auth/update-user-email-password`, {
        credentials: "include",
        body: bodyContent,
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        toast.success(response.msg);
        return response;
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const getUserDetails = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/user-details`, {
        credentials: "include",
        headers: headersList,
        method: "GET",
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        return response;
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const updateUserDetails = async (formData) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
      };
      // const bodyContent = JSON.stringify(obj);
      const data = await fetch(`${host}/api/auth/update-user-details`, {
        credentials: "include",
        headers: headersList,
        method: "PUT",
        body: formData,
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        toast.success(response.msg);
        return response;
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const deleteuser = async () => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        "Content-Type": "application/json",
        token: user.token,
      };

      const data = await fetch(`${host}/api/auth/delete-user`, {
        credentials: "include",
        headers: headersList,
        method: "DELETE",
      });

      let response = await data.json();
      console.log(response);
      if (response.status) {
        setNotification([]);
        setMessages([]);
        setChatToken(null);
        setIsLoggedIn(false);
        navigate("/");
        Cookies.remove("user");
        Cookies.remove("token");
        setUserDetails({
          name: null,
          username: null,
          profilePicture: null,
        });
        socket.emit("customDisconnect");
        deleteToken();
        toast.error(response.msg);
        return response;
      } else {
        console.log(response);
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  useEffect(() => {
    for (let a of notification) {
      if (!a.seen) {
        setNotificationBadge(true);
        break;
      }
    }
  }, [notification, setNotificationBadge]);

  useEffect(() => {
    const handleNewNotification = (object) => {
      setNotification((prev) => [object, ...prev]);
      setNotificationBadge(true);
      toast(
        <CustomToast
          img={object.userProfile}
          msg={object.msg}
          userName={object.userName}
          post={object.post}
          link={`/profile/${object.userName}`}
        />,
      );
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleNewMessage = (object) => {
      if (location.pathname === `/message/${object.msg.sender}`) {
        setMessages((s) => [...s, object.msg]);
        setTimeout(() => {
          dummyRef.current.scrollIntoView({ block: "end" });
        }, 100);
      } else {
        toast(
          <CustomToast
            img={object.n.userProfile}
            msg={object.n.msg}
            userName={object.n.userName}
            link={`/message/${object.msg.sender}`}
          />,
        );

        for (const [index, item] of conversationsList.entries()) {
          if (object.msg.sender === item.userName) {
            conversationsList.splice(index, 1);
            let tempObj = item;
            tempObj.lastMessage = object.msg;
            setConversationsList([tempObj, ...conversationsList]);
            conversationsList.push(tempObj);
            break;
          }
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, conversationsList]);

  useEffect(() => {
    if (Cookies.get("token") != undefined) {
      setIsLoggedIn(true);
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <userContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userDetails,
        setUserDetails,
        verifyEmail,
        registerUser,
        logout,
        checkEmail,
        login,
        getUserProfile,
        setSettings,
        settings,
        accountType,
        changeAccountType,
        handleFollowUnfollow,
        notification,
        setNotification,
        getUserNotifications,
        setNotificationBadge,
        notificationBadge,
        markNotificationSeen,
        notificationCount,
        acceptFollowRequest,
        getConversations,
        getChatToken,
        chatToken,
        setChatToken,
        setMessages,
        messages,
        getChats,
        messagesCount,
        setMessagesCount,
        dummyRef,
        conversationsList,
        setConversationsList,
        markMessagesSeen,
        verifyUserPassword,
        updateUserEmailPassword,
        getUserDetails,
        updateUserDetails,
        deleteuser,
        notificationLoader,
        setNotificationLoader,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

UserState.propTypes = {
  children: PropTypes.any,
};

export default UserState;
