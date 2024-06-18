import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userContext from "../../Context/auth/userContext";
import defaultProfilePicture from "../../assets/Images/default-profile-picture.png";
import Loader from "../../Components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

const Notifications = () => {
  const {
    notification,
    getUserNotifications,
    setNotificationBadge,
    handleFollowUnfollow,
    notificationCount,
    notificationBadge,
    markNotificationSeen,
    acceptFollowRequest,
    setNotification,
    notificationLoader,
  } = useContext(userContext);
  const [pageNumber, setPageNumber] = useState(2);

  const [sloader, setSLoader] = useState(false);

  const handleFollowBtn = async (id, userName) => {
    const btn = document.getElementById(id);
    btn.innerText = "Please Wait";
    const data = await handleFollowUnfollow(userName);
    if (data) {
      btn.innerText = data.buttonText;
    }
  };

  const featchNotification = async () => {
    await getUserNotifications(pageNumber);
    setPageNumber((prev) => prev + 1);
  };

  const handleRequest = async (id, type, i) => {
    setSLoader(true);

    const data = await acceptFollowRequest(id, type);
    if (data) {
      notification.splice(i, 1);
      setNotification([...notification]);
    }
    setSLoader(false);
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
    if (notificationBadge) {
      for (let a of notification) {
        if (a.seen) {
          a.seen = false;
        }
      }
      markNotificationSeen();
      setNotificationBadge(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex  w-full flex-col items-center   ">
        <div
          className={`sticky top-[8vh] z-10 flex w-full items-center border-b border-gray-200  bg-white py-3 pl-3 md:top-0  md:w-[50%]  md:justify-start`}
        >
          Notifications
        </div>
        <div className="m-5 md:w-[50%]  xl:w-[30%]">
          {notificationLoader ? (
            <div className="flex w-full items-center justify-center">
              <Loader width={"w-[30px] "} />
            </div>
          ) : notification.length === 0 ? (
            <div className="flex w-full items-center justify-center">
              No notification
            </div>
          ) : (
            <InfiniteScroll
              dataLength={notification.length}
              next={featchNotification}
              hasMore={!(notification.length === notificationCount)}
              loader={
                <div className="flex w-full items-center justify-center">
                  <Loader width={"w-[30px] "} />
                </div>
              }
            >
              {notification.map((item, i) => {
                return (
                  <div
                    key={item._id}
                    className="relative  flex w-full flex-row items-center p-2 "
                  >
                    <div className="w-[10%] md:w-[3vw]">
                      <img
                        src={
                          item.userProfile
                            ? item.userProfile
                            : defaultProfilePicture
                        }
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "50%",
                          backgroundColor: "black",
                          width: "100%",
                          objectFit: "contain",
                          margin: "0 0 0 -10px",
                        }}
                      />
                    </div>
                    <div className="w-[60% ] text-xs">
                      <Link
                        to={`/profile/${item.userName}`}
                        className="font-bold"
                      >
                        {item.userName} &nbsp;
                      </Link>
                      {item.msg}
                      <span className="block text-[10px] text-gray-500">
                        {item.time}
                      </span>
                    </div>
                    <div className=" flex w-[10%] flex-1 justify-end">
                      {item.type === "Follow" && (
                        <button
                          id={item._id}
                          onClick={() =>
                            handleFollowBtn(item._id, item.userName)
                          }
                          className="rounded bg-blue-500 p-2 text-xs text-white "
                        >
                          {item.btnText}
                        </button>
                      )}

                      {(item.type === "Like" || item.type === "Comment") && (
                        <img
                          className="w-[10vw] md:w-[3vw]"
                          src={item.post}
                          style={{
                            aspectRatio: "1/1",
                            borderRadius: "5px",
                            backgroundColor: "black",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {item.type === "Request" && (
                        <div className=" flex w-full items-center justify-end ">
                          {sloader ? (
                            <div className="flex w-full items-center justify-center">
                              <Loader width={"w-[30px] "} />
                            </div>
                          ) : (
                            <>
                              <i
                                className=" fa-solid fa-check ml-4 cursor-pointer text-xl  "
                                title="accept"
                                onClick={() =>
                                  handleRequest(item._id, "accept", i)
                                }
                              ></i>
                              <i
                                className=" fa-solid fa-xmark ml-4 cursor-pointer text-xl  "
                                title="decline"
                                onClick={() =>
                                  handleRequest(item._id, "decline", i)
                                }
                              ></i>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
