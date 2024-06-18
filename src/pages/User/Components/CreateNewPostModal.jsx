import PropTypes from "prop-types";
import { useContext, useRef, useState } from "react";
import SelectImg from "./CreateNewPost/SelectImg";
import CropImg from "./CreateNewPost/CropImg";
import FilterImg from "./CreateNewPost/FilterImg";
import postContext from "../../../Context/post/postContext";
import Loader from "../../../Components/Loader";

const CreateNewPostModal = ({ createNewPostModal, setCreateNewPostModal }) => {
  const [img, setImg] = useState("");
  const [showSelectImg, setShowSelectImg] = useState(true);
  const [showCropImg, setShowCropImg] = useState(false);
  const [showFilterImg, setShowFilterImg] = useState(false);
  const [croppedImg, setCopedImg] = useState("");
  const filterImgRef = useRef(null);
  const [caption, setCaption] = useState("");
  const { addPost } = useContext(postContext);
  const [showModal, setShowModal] = useState(false);

  const addNewPost = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "image.png");
    formData.append("caption", caption);
    setShowModal(true);
    setShowFilterImg(false);
    await addPost(formData);
    setCreateNewPostModal(false);
    setShowModal(false);
  };
  return (
    createNewPostModal && (
      <div className="fixed inset-0 z-[999] h-full w-full ">
        <div
          title="close"
          onClick={() => {
            setCreateNewPostModal(false);
            setShowSelectImg(true);
            setImg("");
            setShowCropImg(false);
            setShowFilterImg(false);
          }}
          className="absolute right-3 top-3 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="flex  h-full w-full items-center justify-center  ">
          <div className="z-[999]   max-h-[70%] w-[50%]  rounded-lg bg-white p-8">
            {showModal && (
              <div className="flex w-full flex-col items-center">
                <div className="flex w-full items-center justify-center">
                  <Loader width={"w-[30px] "} />
                </div>
                <span className="my-3 font-bold">Uploading Image...</span>
              </div>
            )}
            {showSelectImg && (
              <SelectImg
                setShowSelectImg={setShowSelectImg}
                setImg={setImg}
                setShowCropImg={setShowCropImg}
                setShowFilterImg={setShowFilterImg}
                setCaption={setCaption}
              />
            )}
            {showCropImg && (
              <CropImg
                img={img}
                setCopedImg={setCopedImg}
                setShowSelectImg={setShowSelectImg}
                setShowCropImg={setShowCropImg}
                setShowFilterImg={setShowFilterImg}
              />
            )}

            {showFilterImg && (
              <FilterImg
                addNewPost={addNewPost}
                showFilterImg={showFilterImg}
                croppedImg={croppedImg}
                setShowSelectImg={setShowSelectImg}
                setShowCropImg={setShowCropImg}
                setShowFilterImg={setShowFilterImg}
                filterImgRef={filterImgRef}
              />
            )}
          </div>
        </div>

        {/* Modal Overlay */}
        <div
          onClick={() => {
            setCreateNewPostModal(false);
            setShowSelectImg(true);
            setImg("");
            setShowCropImg(false);
            setShowFilterImg(false);
          }}
          className="fixed inset-0 bg-black opacity-25"
        ></div>
      </div>
    )
  );
};

CreateNewPostModal.propTypes = {
  createNewPostModal: PropTypes.bool,
  setCreateNewPostModal: PropTypes.func,
};

export default CreateNewPostModal;
