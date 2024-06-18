import { useState, useEffect, useRef, useCallback, useContext } from "react";
import useMeasure from "react-use-measure";
import "../../../../index.css";
import Loader from "../../../../Components/Loader";
import userContext from "../../../../Context/auth/userContext";
import PropTypes from "prop-types";
import defaultProfileImg from "../../../../assets/Images/default-profile-picture.png";
import { Link } from "react-router-dom";

const Chat = ({ userName, dummyRef, tempUser }) => {
  const {
    messages,
    userDetails,
    getChats,
    messagesCount,
    setMessagesCount,
    setMessages,
    markMessagesSeen,
  } = useContext(userContext);

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const heightRef = useRef(0);
  const [ref, { height: newHeight }] = useMeasure();
  const [callApi, setCallApi] = useState(true);

  const handleScrollToTop = async () => {
    if (callApi) {
      setLoading(true);
      setCallApi(false);
      const data = await getChats(pageNumber);
      console.log(data);
      if (data) {
        setMessages((s) => [...data.messages, ...s]);
        setMessagesCount(data.messagesCount);
        setPageNumber((prev) => prev + 1);
      }
      setLoading(false);
    }
    setCallApi(messages.length < messagesCount);
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      dummyRef.current.scrollIntoView();
    }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToLast = useCallback(() => {
    if (newHeight > heightRef.current) {
      scrollRef.current.scrollTop = newHeight - heightRef.current;
      heightRef.current = newHeight;
    }
  }, [newHeight]);

  useEffect(() => {
    if (!scrollRef.current || !dummyRef.current) {
      return;
    }

    if (messages.length <= 5) {
      heightRef.current = newHeight;
      scrollToBottom();
      return;
    }

    scrollToLast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToBottom, scrollToLast, messages]);

  const handleOnScroll = () => {
    if (scrollRef.current.scrollTop === 0) {
      if (callApi) {
        if (messagesCount >= messages.length) {
          handleScrollToTop();
        }
      }
    }
  };

  useEffect(() => {
    markMessagesSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-2 md:mt-[1vh]">
      <div className="relative w-[100%]">
        <div
          className="scrollbar-hide h-[64vh]  md:h-[83vh]"
          ref={scrollRef}
          onScroll={handleOnScroll}
          style={{
            overflowY: "scroll",
          }}
        >
          <Link
            to={`/profile/${userName}`}
            className="flex h-[20vh]  w-full flex-col items-center justify-center"
          >
            <img
              className="h-[100px] w-[100px] rounded-[50%]  bg-black"
              style={{ objectFit: "contain" }}
              src={tempUser.profile ? tempUser.profile : defaultProfileImg}
            />
            {userName}
          </Link>
          <div ref={ref}>
            {loading && (
              <div className="flex w-full items-center justify-center p-2">
                <Loader width={"w-[30px]  "} />
              </div>
            )}

            {messages.map((item, index) => (
              <div key={index} className="relative flex  flex-col">
                <div
                  style={{
                    overflowWrap: "anywhere",
                    borderRadius:
                      userDetails.userName === item.sender
                        ? " 15% 15% 0% 15% "
                        : "15% 15% 15% 0%",
                  }}
                  className={`my-2 flex h-[auto] w-[auto] max-w-[80%] flex-col flex-wrap rounded-md border px-2 ${userDetails.userName === item.sender ? " items-end self-end " : "items-start self-start"}`}
                >
                  {item.message}
                  <span className="flex w-[100%] justify-end  text-[9px] text-gray-400">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={dummyRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  dummyRef: PropTypes.any,
  tempUser: PropTypes.any,
  userName: PropTypes.any,
};

export default Chat;
