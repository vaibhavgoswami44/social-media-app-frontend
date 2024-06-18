import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import NewChatModal from "./Components/NewChatModal";
import userContext from "../../Context/auth/userContext";
import Loader from "../../Components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import DefaultProfileImg from "../../assets/Images/default-profile-picture.png";

const Message = () => {
  const { conversationsList, setConversationsList } = useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getConversations, userDetails } = useContext(userContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [conversationsCount, setConversationsCount] = useState(1);
  const [loader, setLoader] = useState(false);

  const getConversationsH = async () => {
    if (pageNumber === 1) {
      setLoader(true);
    }
    let a = {
      pageNumber: pageNumber + 1,
    };
    let conversations = await getConversations(a);

    if (conversations) {
      setConversationsList((prev) =>
        prev.concat(conversations.conversationsList),
      );
      setPageNumber(pageNumber + 1);
      setConversationsCount(conversations.conversationsCount);
    }
    if (pageNumber === 1) {
      setLoader(false);
    }
  };

  useEffect(() => {
    getConversationsH();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onReturn = () => {
      setIsModalOpen(false);
      setConversationsList([]);
    };
    return onReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex  w-full flex-col items-center   ">
      {isModalOpen && (
        <NewChatModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div
        className={`sticky top-[8vh] z-10 flex w-full items-center border-b border-gray-200  bg-white py-3 pl-3 md:top-0  md:w-[50%]  md:justify-start`}
      >
        <span className="mx-2 ml-3 font-bold">Messages</span>
        <span
          title="New Chat"
          onClick={() => setIsModalOpen(true)}
          className="absolute right-2 ml-3 font-bold"
        >
          <i className="fa-regular fa-pen-to-square cursor-pointer text-xl"></i>
        </span>
      </div>

      {loader ? (
        <div className="flex w-full items-center justify-center">
          <Loader width={"w-[30px] "} />
        </div>
      ) : conversationsList.length === 0 ? (
        <div className="flex w-full items-center justify-center">
          No Conversations.
        </div>
      ) : (
        <div className="w-full md:w-[40%] ">
          <InfiniteScroll
            dataLength={conversationsList.length}
            next={getConversationsH}
            hasMore={conversationsList.length < conversationsCount}
            loader={
              <div className="flex w-full items-center justify-center">
                <Loader width={"w-[30px]  "} />
              </div>
            }
            style={{ width: "100%" }}
            className="my-5"
          >
            {conversationsList.map((item, i) => (
              <Link
                to={`/message/${item.userName}`}
                key={i}
                className="mb-[10vh] w-full  hover:bg-gray-100"
              >
                <div className=" flex w-full  border-b border-gray-200  py-3 pl-3 ">
                  <img
                    className=" h-[30px] w-[30px] rounded-[50%]"
                    src={item.profileImg ? item.profileImg : DefaultProfileImg}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="ml-3 flex flex-col justify-center">
                    <span className=" cursor-pointer text-sm font-bold">
                      {item.userName}
                    </span>
                    {item.lastMessage && (
                      <span
                        className={`text-xs  ${item.lastMessage.seen ? "text-gray-400" : " font-bold text-black"} `}
                      >
                        {item.lastMessage.sender === userDetails.userName
                          ? "You"
                          : item.lastMessage.sender}
                        &nbsp;&nbsp;
                        {item.lastMessage.message}
                        <span className="mx-1 mb-[2px] inline-block h-[3px] w-[3px] rounded-[50%] bg-gray-400"></span>
                        {item.lastMessage.time}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Message;
