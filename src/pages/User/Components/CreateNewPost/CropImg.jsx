import { useRef } from "react";
import PropTypes from "prop-types";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropImg = ({
  img,
  setCopedImg,
  setShowFilterImg,
  setShowCropImg,
  setShowSelectImg,
}) => {
  const cropperRef = useRef();
  return (
    <div className="relative flex h-full w-full flex-col md:w-[100%]  mt-[8vh]  md:mt-0">
      <div className="flex w-full justify-between p-5">
        <span
          title="back"
          className="cursor-pointer"
          onClick={() => {
            setShowFilterImg(false);
            setShowCropImg(false);
            setShowSelectImg(true);
          }}
        >
          <i className=" fa-solid fa-arrow-left cursor-pointer"></i> Back
        </span>
        <span className=""> Crop Your Image</span>
        <span
          className="cursor-pointer"
          onClick={() => {
            setShowCropImg(false);
            setShowFilterImg(true);
            setShowSelectImg(false);
            setCopedImg(
              cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
            );
          }}
          title="next"
        >
          Next <i className=" fa-solid fa-arrow-right  cursor-pointer"></i>
        </span>
      </div>
      <div className=" mt-10 w-full ">
        <div className="flex h-[40vh] w-full flex-col items-center  justify-center">
          <Cropper
            src={img}
            style={{ height: "80%", maxWidth: "80%" }}
            guides={true}
            ref={cropperRef}
            dragMode="move"
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <button
            onClick={() => {
              var link = document.createElement("a");
              link.href = cropperRef.current?.cropper
                .getCroppedCanvas()
                .toDataURL();
              link.download = "image.png"; // or 'downloaded_image.jpg'
              link.click();
            }}
            className="mt-3  cursor-pointer bg-blue-600 p-3 text-center text-white"
          >
            Save Image To Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

CropImg.propTypes = {
  setCopedImg: PropTypes.func,
  img: PropTypes.string,
  setShowFilterImg: PropTypes.func,
  setShowCropImg: PropTypes.func,
  setShowSelectImg: PropTypes.func,
};

export default CropImg;
