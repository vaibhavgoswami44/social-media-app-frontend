import { useContext, useEffect, useState } from "react";
import defaultProfilePicture from "../../../../assets/Images/default-profile-picture.png";
import userContext from "../../../../Context/auth/userContext";
import { toast } from "react-toastify";
import Loader from "../../../../Components/Loader";
var todayDate = new Date().toISOString().split("T")[0];
const EditProfile = () => {
  const { getUserDetails, updateUserDetails } = useContext(userContext);
  const [userDetailsTemp, setUserDetailsTemp] = useState({
    photo: null,
    userName: "",
    name: "",
    webSite: "",
    bio: "",
    birthday: todayDate,
    gender: "",
  });
  const [loader, setLoader] = useState(false);

  const getDetails = async () => {
    const data = await getUserDetails();
    if (data) {
      const imageUrl = data.userDetailsTemp.photo
        ? data.userDetailsTemp.photo
        : defaultProfilePicture;

      const convertToBase64 = async () => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            setUserDetailsTemp({ ...data.userDetailsTemp, photo: base64data });
          };
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      };

      convertToBase64();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.warn("Please Select Image");
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserDetailsTemp({
            ...userDetailsTemp,
            [e.target.name]: reader.result,
          });
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleOnChange = (e) => {
    return setUserDetailsTemp({
      ...userDetailsTemp,
      [e.target.name]: e.target.value,
    });
  };
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" }); // Adjust type according to your image type
  }
  const removeProfile = async () => {
    const convertToBase64 = async () => {
      try {
        const response = await fetch(defaultProfilePicture);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setUserDetailsTemp({ ...userDetailsTemp, photo: base64data });
        };
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    };

    convertToBase64();
  };
  const updateUser = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("webSite", userDetailsTemp.webSite);
    formData.append("bio", userDetailsTemp.bio);
    formData.append("birthday", userDetailsTemp.birthday);
    formData.append("gender", userDetailsTemp.gender);
    const photoBlob = dataURItoBlob(userDetailsTemp.photo);
    formData.append("photo", photoBlob, "photo.png");
    // {
    //   webSite: userDetailsTemp.webSite,
    //   bio: userDetailsTemp.bio,
    //   birthDay: userDetailsTemp.birthday,
    //   gender: userDetailsTemp.gender,
    //   photo: userDetailsTemp.photo,
    // }

    await updateUserDetails(formData);
    setLoader(false);
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex w-full justify-center px-4">
      <div className="w-full md:w-[50%]">
        <span className="my-3 block text-xl font-bold">Edit Profile</span>
        <div className="flex w-full items-center rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          <div className="flex w-full flex-row">
            <div className="h-[77px] w-[77px] cursor-pointer  md:h-[100px] md:w-[100px] ">
              <img
                className="h-full w-full rounded-[50%] bg-black"
                style={{ objectFit: "contain" }}
                src={
                  userDetailsTemp.photo
                    ? userDetailsTemp.photo
                    : defaultProfilePicture
                }
              />
            </div>
            <div className="ml-2 flex flex-col justify-center ">
              <span className="font-bold">{userDetailsTemp.userName}</span>
              <span className="">{userDetailsTemp.name}</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image"
            name="photo"
            onChange={handleFileChange}
          />
          <div className="w-[50%]">
            <button className=" font-dark my-1 h-[32px] w-full rounded-md bg-blue-500 text-white">
              <label htmlFor="image">Change profile</label>
            </button>
            <button className=" font-dark my-1 h-[32px] w-full rounded-md bg-blue-500 text-white">
              <label onClick={removeProfile}>Remove profile</label>
            </button>
          </div>
        </div>

        <div className="my-3 flex flex-col ">
          <span className="font-bold">Website</span>
          <input
            type="text"
            className="mt-2 rounded border border-gray-300 bg-gray-100 p-3 outline-black focus:outline"
            placeholder="Website"
            value={userDetailsTemp.webSite}
            name="webSite"
            onChange={handleOnChange}
          />
        </div>
        <div className="my-3 flex flex-col ">
          <span className="font-bold">Bio</span>
          <textarea
            value={userDetailsTemp.bio}
            className="mt-2 rounded border border-gray-300 bg-gray-100 p-3 outline-black focus:outline"
            placeholder="Bio"
            name="bio"
            onChange={handleOnChange}
          />
        </div>
        <div className="my-3 flex flex-col ">
          <span className="font-bold">Birthday</span>
          <input
            type="date"
            value={userDetailsTemp.birthday}
            max={todayDate}
            className="mt-2 rounded border border-gray-300 bg-gray-100 p-3 outline-black focus:outline"
            placeholder="Bio"
            name="birthday"
            onChange={handleOnChange}
          />
        </div>
        <div className="my-3 flex flex-col ">
          <span className="font-bold">Gender</span>
          <select
            name="gender"
            onChange={handleOnChange}
            className="mt-2 rounded border border-gray-300 bg-gray-100 p-3 outline-black focus:outline"
          >
            {["Male", "Female"].map((gender) => {
              return (
                <option
                  key={gender}
                  value={gender}
                  selected={userDetailsTemp.gender === gender}
                >
                  {gender}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex w-full justify-end">
          <button
            onClick={updateUser}
            className="min-w-[5vw] cursor-pointer rounded-md bg-blue-500 px-5 py-3  text-white"
          >
            {loader ? (
              <div className="flex w-full  items-center justify-center">
                <Loader width={"w-[30px] "} />
              </div>
            ) : (
              " Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
