import { Link, Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import ProfilePage from "./ProfilePage";
import Page404 from "../Page404";
import "../../index.css";
import Search from "./Search";
import Home from "./Home";
import Message from "./Message";
import Notifications from "./Notifications";
import CreateNewPost from "./Components/CreateNewPost/Index";
import Settings from "./Settings";
import { useContext } from "react";
import userContext from "../../Context/auth/userContext";
import Chats from "./Components/Chats";

const Dashboard = () => {
  const { notificationBadge } = useContext(userContext);
  return (
    <>
      <div className=" max-width-768px-position-fixed top-0 z-[999]  flex h-[8vh] w-full items-center justify-between border-b border-gray-300 bg-white px-2 md:hidden xl:hidden ">
        <div className="w-[25%]">
          <img className="w-full" src="/app-logo-text.png" />
        </div>

        <div className="flex">
          <Link to="/create">
            <i className="fa-solid   fa-plus mx-2 cursor-pointer text-xl "></i>
          </Link>

          <Link to="/notifications" className="relative flex">
            {notificationBadge && (
              <div
                style={{ borderRadius: "50%" }}
                className="absolute right-[5px] top-[2px] h-[5px] w-[5px] bg-red-900"
              ></div>
            )}
            <i className="fa-regular fa-heart mx-2 cursor-pointer pb-[0.10rem] text-xl"></i>
          </Link>
        </div>
      </div>
      <div className=" flex flex-row">
        <NavigationBar />
        <div className="  h-full w-full md:p-0 xl:p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/profile/:userName" element={<ProfilePage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/message" element={<Message />} />
            <Route path="/message/:userName" element={<Chats />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create" element={<CreateNewPost />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
