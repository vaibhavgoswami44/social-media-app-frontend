import { Link, Route, Routes, useLocation } from "react-router-dom";
import Page404 from "../Page404";
import EditProfile from "./Components/Settings/EditProfile";
import AccountPrivacy from "./Components/Settings/AccountPrivacy";
import Security from "./Components/Settings/Security";
import DeleteAccount from "./Components/Settings/DeleteAccount";
import PersonalDetails from "./Components/Settings/PersonalDetails";
import { useContext, useEffect, useState } from "react";
import userContext from "../../Context/auth/userContext";
import Loader from "../../Components/Loader";

const Settings = () => {
  const location = useLocation();
  const { logout, settings, setSettings } = useContext(userContext);
  const [loader, setLoader] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 778) {
      setSettings(true);
    }
  }, []);

  const signOut = async () => {
    setLoader(true);
    await logout();
    setLogoutModal(false);
    setLoader(false);
  };
  return (
    <>
      {logoutModal && (
        <>
          <div className="fixed inset-0 z-[9999]  overflow-y-auto">
            <div className="z-[9999] flex min-h-screen items-center justify-center p-4">
              <div className=" z-[9999] rounded-lg bg-white p-8">
                {/* Modal Content */}
                <p>Are you sure you want to logout ?</p>

                {/* Close Button */}
                <div className="flex items-end justify-end">
                  <button
                    onClick={() => setLogoutModal(false)}
                    className="mx-1 mt-6 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={signOut}
                    className="mx-1 mt-6 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  >
                    {loader ? (
                      <div className="flex w-full items-center justify-center">
                        <Loader width={"w-[30px] "} />
                      </div>
                    ) : (
                      "Sign Out"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Overlay */}
            <div
              onClick={() => setLogoutModal(false)}
              className="fixed inset-0 bg-black opacity-25"
            ></div>
          </div>
        </>
      )}
      <div className="flex flex-col md:h-[100vh] md:flex-row ">
        <div
          className={`flex  w-full flex-row border-b border-gray-300 bg-white md:h-[100%] md:w-[10vw] md:flex-col md:border-r xl:w-[20vw]  ${settings ? "translate-x-0 translate-y-[0vh] md:translate-x-[10vw] md:translate-y-0 xl:translate-x-[18vw]" : "-translate-y-full md:-translate-x-full md:-translate-y-[0]"} transition-transform duration-300 ease-in-out  `}
        >
          {window.innerWidth >= 1000 && (
            <div className="px-3 py-5">
              <span className="hidden text-xl font-bold xl:inline">
                Settings
              </span>
            </div>
          )}
          <div className="flex w-full flex-row items-center justify-around p-5 md:h-full  md:w-[10vw] md:flex-col  md:justify-start  xl:w-[20vw]">
            <Link
              to="/settings/"
              className="group mt-3 flex cursor-pointer rounded hover:bg-gray-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-black p-2 md:group-hover:scale-110">
                <i className="fa-solid fa-user  text-xl  "></i>
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/" && "font-bold"}`}
                >
                  Edit Profile
                </span>
              )}
            </Link>
            <Link
              to="/settings/account-privacy"
              className="group mt-3 flex cursor-pointer rounded hover:bg-gray-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-black p-2 md:group-hover:scale-110">
                <i className="fa-solid  fa-lock text-xl "></i>
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/account-privacy" && "font-bold"}`}
                >
                  Account Privacy
                </span>
              )}
            </Link>
            <Link
              to="/settings/security"
              className="group mt-3 flex cursor-pointer rounded hover:bg-gray-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-black p-2 md:group-hover:scale-110">
                <i className="fa-solid fa-shield text-xl "></i>
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/security" && "font-bold"}`}
                >
                  Password and Security
                </span>
              )}
            </Link>
            {/* <Link
              to="/settings/personal-details"
              className="group mt-3 flex cursor-pointer rounded  hover:bg-gray-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-black md:group-hover:scale-110">
                <img src={PersonalDetailsIcon} />
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/personal-details" && "font-bold"}`}
                >
                  Personal Details
                </span>
              )}
            </Link> */}
            <div
              onClick={() => setLogoutModal(true)}
              className="group mt-3 flex cursor-pointer rounded  hover:bg-gray-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-black md:group-hover:scale-110">
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/delete-user" && "font-bold"}`}
                >
                  Sign Out
                </span>
              )}
            </div>
            <Link
              to="/settings/delete-account"
              className="group mt-3 flex cursor-pointer rounded hover:bg-red-100 md:w-full  md:p-2"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%]  border border-[red] p-2 md:group-hover:scale-110">
                <i className="fas fa-user-times text-xl  text-[red]"></i>
              </span>
              {window.innerWidth >= 1000 && (
                <span
                  className={`ml-3 hidden xl:inline ${location.pathname === "/settings/delete-user" && "font-bold"}`}
                >
                  Delete Account
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="flex-1 bg-[#f1f3f5] pb-5 pt-5">
          <Routes>
            <Route path="/" element={<EditProfile />} />
            <Route path="/account-privacy" element={<AccountPrivacy />} />
            <Route path="/security" element={<Security />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/personal-details" element={<PersonalDetails />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Settings;
