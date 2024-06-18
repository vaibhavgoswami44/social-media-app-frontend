import { Link } from "react-router-dom";
import Chat from "./Settings/Chat";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userContext from "../../../Context/auth/userContext";
import Cookies from "js-cookie";
import socket from "../../../Socket/Socket";
import Loader from "../../../Components/Loader";
import defaultProfileImg from "../../../assets/Images/default-profile-picture.png";

const Chats = () => {
  const { userName } = useParams();
  const { getChatToken, setMessages, chatToken, dummyRef } =
    useContext(userContext);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(true);
  const [tempUser, setTempUser] = useState({
    profile: null,
  });

  const sendMessage = () => {
    const user = JSON.parse(Cookies.get("token"));
    const obj = {
      token: {
        chatToken,
        userToken: user.token,
      },
      msg,
    };
    setMessages((s) => [...s, msg]);
    socket.emit("sendMessage", obj, (response) => {
      if (response.status) {
        setMessages((s) => s.slice(0, -1).concat(response.msg));
        setMsg("");
        setTimeout(() => {
          dummyRef.current.scrollIntoView({ block: "end" });
        }, 100);
      } else {
        console.error("Error sending message:", response.error);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setTimeout(() => {
        dummyRef.current.scrollIntoView({ block: "end" });
      }, 100);
    }
  };

  const getToken = async () => {
    setLoader(true);
    const data = await getChatToken(userName);
    setLoader(false);
    if (data) {
      setUser(false);
      setTempUser(data);
    } else {
      setUser(true);
    }
  };

  useEffect(() => {
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    const onReturn = () => {
      setMessages([]);
      setMsg("");
      setTempUser({
        profile: null,
      });
    };
    return onReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loader ? (
        <div className="flex h-[20vh] w-full items-center  justify-center">
          <Loader width={"w-[30px]  "} />
        </div>
      ) : user ? (
        <div className="flex h-[20vh] w-full items-center  justify-center">
          <span>User Not Found</span>
        </div>
      ) : (
        <div className="  flex h-full w-full flex-col  items-center  ">
          <div className="relative mb-auto flex h-full w-full flex-col md:w-[50%]  ">
            <div className="sticky top-[8vh] z-20 bg-white md:top-1">
              <div className=" z-20 flex  w-full border-b border-gray-200  py-3 pl-3 ">
                <Link to="/message" title="Back" className="ml-1 mr-5">
                  <i className="fa-solid fa-arrow-left"></i>
                </Link>
                <img
                  className=" h-[30px] w-[30px] rounded-[50%]"
                  src={tempUser.profile ? tempUser.profile : defaultProfileImg}
                  style={{ objectFit: "contain" }}
                />
                <Link
                  to={`/profile/${userName}`}
                  className="z-20 ml-3 flex flex-col"
                >
                  <span className="flex h-full cursor-pointer items-center justify-center text-sm font-bold">
                    {userName}
                  </span>
                </Link>
              </div>
            </div>
            <Chat userName={userName} dummyRef={dummyRef} tempUser={tempUser} />
            <div className=" fixed bottom-[8vh] flex w-full rounded-md  border bg-white p-3 md:bottom-0 md:w-[50%] ">
              <input
                className=" w-full focus:outline-none"
                placeholder="Message"
                value={msg}
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                required
              />
              <button
                onClick={sendMessage}
                className="  absolute right-3 top-3 cursor-pointer font-bold text-blue-500"
              >
                send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
