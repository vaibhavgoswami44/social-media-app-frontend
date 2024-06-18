import { Link, useLocation } from "react-router-dom";
import "../../../index.css";
import { useContext, useState } from "react";
import CreateNewPostModal from "./CreateNewPostModal";
import defaultProfilePicture from "../../../assets/Images/default-profile-picture.png";
import userContext from "../../../Context/auth/userContext";

const NavigationBar = () => {
  const location = useLocation();
  const [createNewPostModal, setCreateNewPostModal] = useState(false);
  const {
    userDetails,
    setSettings,
    notificationBadge,
    markNotificationSeen,
    setNotificationBadge,
  } = useContext(userContext);

  const markNotification = () => {
    if (notificationBadge) {
      markNotificationSeen();
      setNotificationBadge(false);
    }
  };

  return (
    <>
      {/* Create New Post Modal */}
      {window.innerWidth >= 778 && (
        <CreateNewPostModal
          createNewPostModal={createNewPostModal}
          setCreateNewPostModal={setCreateNewPostModal}
        />
      )}

      <div className="fixed bottom-0 z-[900] w-full border-r border-gray-300 bg-white md:h-screen md:w-[10vw] md:pt-10   xl:w-[18.5vw] xl:ps-5">
        {/* logo */}
        <div className="w-full">
          <div className="hidden w-full xl:flex xl:items-center xl:justify-normal ">
            <img className="w-[60%]" src="/app-logo.png" />
          </div>
          <div className=" hidden w-full md:flex md:items-center md:justify-center xl:hidden">
            <img className="w-[40%]" src="/app-logo-small.png" />
          </div>
        </div>

        <div className=" xl:flex.col flex w-full md:h-[80%] md:flex-col xl:h-[80%]  ">
          {/* Home */}
          <Link
            to="/"
            className="group  flex w-full cursor-pointer justify-center bg-white  md:mt-3 md:rounded md:hover:bg-gray-100 xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <i className="fa-solid  fa-house m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span className={`${location.pathname === "/" && "font-bold"}`}>
                Home
              </span>
            </div>
          </Link>

          {/* Search */}
          <Link
            to="/search"
            className="  group flex w-full cursor-pointer justify-center md:mt-3  md:rounded md:hover:bg-gray-100 xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <i className="fa-solid fa-magnifying-glass  m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span
                className={`${location.pathname === "/search" && "font-bold"}`}
              >
                Explore
              </span>
            </div>
          </Link>

          {/* Message */}
          <Link
            to="/message"
            className="group flex w-full cursor-pointer justify-center md:mt-3  md:rounded md:hover:bg-gray-100  xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <i className="fa-regular fa-message m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span
                className={`${location.pathname === "/message" && "font-bold"}`}
              >
                Messages
              </span>
            </div>
          </Link>

          {/* Create */}
          <Link
            onClick={() => setCreateNewPostModal(true)}
            className=" max-width-768px-hidden group flex w-full cursor-pointer justify-center md:mt-3  md:rounded md:hover:bg-gray-100 xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <i className="fa-solid fa-plus m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span>Create</span>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            onClick={markNotification}
            to="/notifications"
            className="max-width-768px-hidden group flex w-full cursor-pointer  justify-center md:mt-3  md:rounded md:hover:bg-gray-100 xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" relative">
              {notificationBadge && (
                <div
                  style={{ borderRadius: "50%" }}
                  className="absolute left-[7px] top-[14px] h-[5px] w-[5px] bg-red-900"
                ></div>
              )}
              <i className="fa-solid fa-heart m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span>Notifications</span>
            </div>
          </Link>

          {/* Profile */}
          <Link
            to={`/profile/${userDetails.userName}`}
            className="group flex w-full cursor-pointer justify-center md:mt-3  md:rounded md:hover:bg-gray-100  xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <img
                style={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "50%",
                  objectFit: "contain",
                }}
                src={
                  userDetails.profilePicture
                    ? userDetails.profilePicture
                    : defaultProfilePicture
                }
                className="  m-3  md:group-hover:scale-110"
                alt="T"
              />
            </div>
            <div className="hidden xl:flex  xl:items-center xl:justify-center  ">
              <span
                className={`${location.pathname === "/profile" && "font-bold"}`}
              >
                {userDetails.userName}
              </span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            onClick={() =>
              window.innerWidth >= 778 && setSettings((prev) => !prev)
            }
            to="/settings"
            className="group flex w-full cursor-pointer justify-center md:mt-3  md:rounded md:hover:bg-gray-100  xl:mt-3  xl:justify-normal xl:rounded-2xl"
          >
            <div className=" ">
              <i className="fa-solid  fa-gear m-3 text-xl md:group-hover:scale-110"></i>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center  ">
              <span
                className={`${location.pathname === "/settings" && "font-bold"}`}
              >
                Settings
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
