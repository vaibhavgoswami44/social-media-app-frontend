import { useContext, useRef, useState } from "react";
import SelectImg from "./SelectImg";
import CropImg from "./CropImg";
import FilterImg from "./FilterImg";
import postContext from "../../../../Context/post/postContext";
import Loader from "../../../../Components/Loader";
const CreateNewPost = () => {
  const [img, setImg] = useState("");
  const { addPost } = useContext(postContext);
  const [showSelectImg, setShowSelectImg] = useState(true);
  const [showCropImg, setShowCropImg] = useState(false);
  const [showFilterImg, setShowFilterImg] = useState(false);
  const [croppedImg, setCopedImg] = useState("");
  const filterImgRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const addNewPost = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "image.png");
    formData.append("caption", caption);
    setShowFilterImg(false);
    setShowModal(true);
    await addPost(formData);
    setShowModal(false);
  };
  return (
    <>
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
          showFilterImg={showFilterImg}
          croppedImg={croppedImg}
          setShowSelectImg={setShowSelectImg}
          setShowCropImg={setShowCropImg}
          setShowFilterImg={setShowFilterImg}
          filterImgRef={filterImgRef}
          addNewPost={addNewPost}
        />
      )}
    </>
  );
};

export default CreateNewPost;
