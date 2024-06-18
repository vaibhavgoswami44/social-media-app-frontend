import { useState } from "react";
import PropTypes from "prop-types";

const SelectImg = ({
  setShowSelectImg,
  setImg,
  setShowFilterImg,
  setShowCropImg,
  setCaption,
}) => {
  const [warn, setWarn] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      setWarn(true);
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImg(reader.result);
        };

        reader.readAsDataURL(file);
      }
      setShowSelectImg(false);
      setShowFilterImg(false);
      setShowCropImg(true);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div>
        <i className="fa-regular fa-image text-5xl"></i>
      </div>
      <span className="my-3 font-bold">Add a photo to create a new post.</span>
      <input
        type="text"
        placeholder="Add caption"
        onChange={(e) => setCaption(e.target.value)}
        className="m-0 mb-5 w-[15vw]  rounded-lg border bg-gray-50   px-2 py-3 focus:border-neutral-600 focus:ring-neutral-600 "
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image"
        onChange={handleFileUpload}
      />
      <label
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 "
        htmlFor="image"
        title="select image from device"
      >
        Select From Device
      </label>
      {warn && (
        <span className="text-sm text-[red]">*Please Select an Image</span>
      )}
    </div>
  );
};

SelectImg.propTypes = {
  setImg: PropTypes.func,
  setShowSelectImg: PropTypes.func,
  setShowFilterImg: PropTypes.func,
  setShowCropImg: PropTypes.func,
  setCaption: PropTypes.func,
};

export default SelectImg;
