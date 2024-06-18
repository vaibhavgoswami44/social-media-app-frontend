import DefaultProfilePicture from "../../assets/Images/default-profile-picture.png";
import { useContext, useEffect, useState } from "react";
import Posts from "./Components/Posts";
import Loader from "../../Components/Loader";
import userContext from "../../Context/auth/userContext";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SavedPosts from "./Components/SavedPosts";
import AdminContext from "../../Context/Admin/AdminContext";

const ProfilePage = () => {
  const { userName } = useParams();
  const [showPosts, setShowPosts] = useState(true);
  const [loader, setLoader] = useState({
    profileLoader: false,
    postLoader: false,
    savedPostLoader: false,
    buttonLoader: false,
    reportLoader: false,
  });
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [profile, setProfile] = useState({
    profilePicture: null,
    name: null,
    userName: null,
    postCount: null,
    followingCount: 0,
    followersCount: 0,
  });
  const { getUserProfile, userDetails, handleFollowUnfollow } =
    useContext(userContext);
  const { reportUser } = useContext(AdminContext);
  const [msg, setMsg] = useState(null);
  const [followButtonText, setFollowButtonText] = useState("Follow");

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const getProfile = async () => {
    setLoader({ ...loader, profileLoader: true });
    let data = await getUserProfile(userName);
    setLoader({ ...loader, profileLoader: false });
    if (data.status) {
      setProfile(data);
      setFollowButtonText(data.buttonText);
    } else {
      setMsg("User Not found");
      toast.error("User Not found");
    }
  };

  const handleFollowButton = async () => {
    setLoader({ ...loader, buttonLoader: true });
    const data = await handleFollowUnfollow(profile.userName);
    if (data) {
      setFollowButtonText(data.buttonText);
      if (data.buttonText && data.buttonText === "Unfollow") {
        setProfile((prev) => ({
          ...prev,
          followersCount: profile.followersCount + 1,
        }));
      }
      if (
        data.buttonText &&
        data.buttonText === "Follow" &&
        !(data.msg && data.msg === "Request canceled")
      ) {
        setProfile((prev) => ({
          ...prev,
          followersCount: profile.followersCount - 1,
        }));
      }
      toast.success(data.msg);
    }
    setLoader({ ...loader, buttonLoader: false });
  };

  const reportUserProfile = async () => {
    setLoader({ ...loader, reportLoader: true });
    await reportUser({ userName, reason: reportReason });
    setLoader({ ...loader, reportLoader: false });
    setReportReason("");
    setShowReportModal(false);
  };

  useEffect(() => {
    getProfile();
    setShowPosts(true);
    setShowSavedPosts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);
  useEffect(() => {
    const clenUp = () => {
      setShowPosts(true);
      setShowSavedPosts(false);
    };
    return clenUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!profile.name) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showReportModal && (
        <div className="fixed inset-0 left-0  top-0 z-[999]  h-[100vh] w-screen  overflow-y-auto ">
          <div
            onClick={() => setShowReportModal(false)}
            className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="flex min-h-screen min-w-[100vw] items-center justify-center  ">
            <div className="min-h[10vh] z-[999] flex min-w-[10vw] flex-col bg-white p-10">
              <span className="self-center justify-self-center">
                Are You sure you want to Report this User?
              </span>
              <div className="m-2  flex w-full flex-col items-center justify-center border-t p-2">
                <span className="self-center justify-self-center">
                  Select Reason
                </span>
                <select
                  className="m-2 p-2"
                  onChange={(e) => {
                    setReportReason(e.target.value);
                  }}
                >
                  <option value={"Misinformation/Fake News"}>
                    Misinformation/Fake News
                  </option>
                  <option value={"Harassment/Bullying"}>
                    Harassment/Bullying
                  </option>
                  <option value={"Violence/Threats"}>Violence/Threats</option>
                  <option value={"Spam/Scam"}>Spam/Scam</option>
                  <option value={"Privacy Violation"}>Privacy Violation</option>
                </select>
                <input
                  type="text"
                  className="m-1 border p-2 focus:outline-none"
                  placeholder="Other Reason"
                  onChange={(e) => {
                    setReportReason(e.target.value);
                  }}
                />
              </div>
              <div className="mt-3 flex w-full items-end justify-end">
                <button
                  className="mx-2 bg-blue-700 p-2 text-white"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="mx-2 bg-[red] p-2 text-white"
                  onClick={() => reportUserProfile()}
                >
                  {loader.reportLoader ? (
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[30px] "} />
                    </div>
                  ) : (
                    "   Report User"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setShowReportModal(false)}
            className="fixed inset-0 bg-black opacity-70"
          ></div>
        </div>
      )}
      {msg && (
        <>
          <div className="mt-[10vh] flex w-full items-center justify-center text-xl text-red-600">
            {msg}
          </div>
        </>
      )}
      {!msg && (
        <div
          className={`${loader.profileLoader && "flex flex-col  items-center justify-center"} h-[100vh] md:ml-[12vw] xl:ml-[18.6vw] `}
        >
          {loader.profileLoader ? (
            <Loader width={"w-[30px]  "} />
          ) : (
            <>
              <div
                className={`${window.innerWidth <= 778 && " z-50 bg-white "}  flex w-full flex-col items-center justify-center md:mt-3`}
              >
                <div className=" flex flex-row border-b border-gray-300 pb-4 md:mt-10 md:pb-10 md:pl-10">
                  <div className="flex items-center  justify-center">
                    <div className="h-[77px] w-[77px] cursor-pointer md:mx-10 md:h-[150px] md:w-[150px]">
                      <img
                        className="h-[100%] w-[100%] border bg-black"
                        style={{ borderRadius: "50%", objectFit: "contain" }}
                        src={
                          profile.profilePicture
                            ? profile.profilePicture
                            : DefaultProfilePicture
                        }
                      />
                    </div>
                  </div>

                  <div className="ml-3 mt-2 p-1">
                    <div>
                      <span className="mx-3 cursor-pointer font-bold">
                        {profile.userName}
                      </span>
                      {userDetails.userName === profile.userName ? (
                        <>
                          <Link
                            to="/settings/"
                            className="cursor-pointer rounded bg-gray-200 px-3 py-1 font-bold"
                          >
                            Edit Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => setShowReportModal(true)}
                            className="inline-block cursor-pointer rounded bg-gray-200 px-3 py-1 font-bold"
                          >
                            Report User
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-5">
                      <span className=" ml-3 mr-2 md:mr-6">
                        <span className="mr-1 font-bold">
                          {profile.postCount}
                        </span>
                        Posts
                      </span>
                      <span className="mx-2 md:mx-6">
                        <span className="mr-1 font-bold">
                          {profile.followingCount}
                        </span>
                        Following
                      </span>
                      <span className="mx-2 md:mx-6">
                        <span className="mr-1 font-bold">
                          {profile.followersCount}
                        </span>
                        Followers
                      </span>
                    </div>
                    <div className="mx-2 mt-5 font-bold">{profile.name}</div>
                    {userDetails.userName != profile.userName && (
                      <div className="my-2 flex w-full">
                        <button
                          onClick={handleFollowButton}
                          className=" mr-[5%] w-[40%] rounded-sm bg-blue-400 p-2 text-white"
                        >
                          {loader.buttonLoader ? (
                            <span className="d-block flex w-[100%] items-center justify-center">
                              <Loader width={"w-[20px]"} />
                            </span>
                          ) : (
                            followButtonText
                          )}
                        </button>
                        <Link
                          to={`/message/${profile.userName}`}
                          className=" mr-[5%] w-[40%] rounded-sm bg-blue-400 p-2 text-center text-white"
                        >
                          Message
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className=" flex w-full flex-row justify-around md:w-[20%]">
                  <div
                    className={`flex cursor-pointer flex-row pt-2 text-gray-400 ${
                      showPosts && "border-t border-black"
                    }`}
                    onClick={() => {
                      setShowSavedPosts(false);
                      setShowPosts(true);
                    }}
                  >
                    <span className={`${showPosts && " text-black"} flex`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label=""
                        className="x1lliihq x1n2onr6 x5n08af w-[18px]"
                        fill="currentColor"
                        role="img"
                        viewBox="0 0 24 24"
                      >
                        <title></title>
                        <rect
                          fill="none"
                          height="18"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          width="18"
                          x="3"
                          y="3"
                        ></rect>
                        <line
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          x1="9.015"
                          x2="9.015"
                          y1="3"
                          y2="21"
                        ></line>
                        <line
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          x1="14.985"
                          x2="14.985"
                          y1="3"
                          y2="21"
                        ></line>
                        <line
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          x1="21"
                          x2="3"
                          y1="9.015"
                          y2="9.015"
                        ></line>
                        <line
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          x1="21"
                          x2="3"
                          y1="14.985"
                          y2="14.985"
                        ></line>
                      </svg>
                      Posts
                    </span>
                  </div>
                  {userDetails.userName === profile.userName && (
                    <div
                      className={`flex cursor-pointer flex-row pt-2 text-gray-400 ${
                        showSavedPosts && "border-t border-black "
                      }`}
                      onClick={() => {
                        setShowPosts(false);
                        setShowSavedPosts(true);
                      }}
                    >
                      <span className={`${showSavedPosts && " text-black"}`}>
                        {showSavedPosts ? (
                          <i className="fa-solid fa-bookmark mr-1 pt-1"></i>
                        ) : (
                          <i className="fa-regular fa-bookmark mr-1 pt-1"></i>
                        )}
                        Saved
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 flex w-full justify-center border-t ">
                <div className="w-[100%] pb-20 md:w-[90%] xl:w-[70%]  ">
                  {showPosts && <Posts />}
                  {showSavedPosts && <SavedPosts />}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
