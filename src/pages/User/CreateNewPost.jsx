import { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../../styles/filters.css";
import Filters from "./Components/utils";
const CreateNewPost = () => {
  const [img, setImg] = useState("");
  const [showImgInputDiv, setShowImgInputDiv] = useState(true);
  const [showCropImgDiv, setShowCropImgDiv] = useState(false);
  const [showFilterImgDiv, setShowFilterImgDiv] = useState(false);
  const [warn, setWarn] = useState(false);
  const [croppedImg, setCropedImg] = useState("");
  const [tab, setTab] = useState("filters");
  const [class_name, setClassName] = useState(null);
  const [customFilter, setCustomFilter] = useState({
    brightness: 1,
    contrast: 1,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    saturate: 1,
    sepia: 0,
  });
  const [filter, setFilter] = useState(
    `brightness(${customFilter.brightness}) contrast(${customFilter.contrast}) grayscale(${customFilter.grayscale}) hue-rotate(${customFilter.hueRotate}deg) invert(${customFilter.invert}) saturate(${customFilter.saturate}) sepia(${customFilter.sepia})`,
  );

  const cropperRef = useRef(null);
  const filterImgRef = useRef(null);

  useEffect(() => {
    setFilter(
      `brightness(${customFilter.brightness}) contrast(${customFilter.contrast}) grayscale(${customFilter.grayscale}) hue-rotate(${customFilter.hueRotate}deg) invert(${customFilter.invert}) saturate(${customFilter.saturate}) sepia(${customFilter.sepia})`,
    );
  }, [customFilter]);

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
      setShowCropImgDiv(true);
      setShowImgInputDiv(false);
    }
  };

  return (
    <div className="flex h-[78vh] flex-col  ">
      {showImgInputDiv && (
        <div className="flex w-full flex-col items-center">
          <div>
            <i className="fa-regular fa-image text-5xl"></i>
          </div>
          <span className="my-3 font-bold">
            Add a photo to create a new post.
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image"
            onChange={handleFileUpload}
          />
          <button className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <label htmlFor="image">Select From Device</label>
          </button>
          {warn && (
            <span className="text-sm text-[red]">*Please Select an Image</span>
          )}
        </div>
      )}

      {showCropImgDiv && (
        <div className="relative flex h-full w-full flex-col  ">
          <div className="flex w-full justify-between p-5">
            <span
              className=""
              onClick={() => {
                setShowCropImgDiv(false);
                setShowImgInputDiv(true);
              }}
            >
              <i className=" fa-solid fa-arrow-left "></i>
            </span>
            <span className=""> Crop Your Image</span>
            <span
              className=""
              onClick={() => {
                setShowCropImgDiv(false);
                setShowImgInputDiv(false);
                setShowFilterImgDiv(true);
                setCropedImg(
                  cropperRef.current?.cropper.getCroppedCanvas().toDataURL(),
                );
              }}
            >
              <i className=" fa-solid fa-arrow-right  "></i>
            </span>
          </div>
          <div className=" mt-10 w-full ">
            <div className="flex h-[40vh] w-full flex-col items-center  justify-center">
              <Cropper
                src={img}
                style={{ height: "80%", width: "80%" }}
                initialAspectRatio={1 / 1}
                guides={false}
                ref={cropperRef}
              />
            </div>
          </div>
        </div>
      )}
      {showFilterImgDiv && (
        <div className="relative flex h-full w-full flex-col  ">
          <div className="flex w-full justify-between  p-5">
            <span
              className=""
              onClick={() => {
                setShowCropImgDiv(true);
                setShowImgInputDiv(false);
                setShowFilterImgDiv(false);
              }}
            >
              <i className=" fa-solid fa-arrow-left "></i>
            </span>
            <span className="">
              Apply Filter On Your Image
              <button onClick={() => {}}>BTN</button>
            </span>
            <span
              className=""
              onClick={() => {
                setShowCropImgDiv(false);
                setShowImgInputDiv(false);
                setShowFilterImgDiv(true);
              }}
            >
              <i className=" fa-solid fa-arrow-right  "></i>
            </span>
          </div>
          <div className="flex w-full flex-col items-center border border-red-900 pb-20">
            <div className="h-[30vh] w-[80%] border border-green-900">
              <img
                ref={filterImgRef}
                className={`${class_name}`}
                src={croppedImg}
                style={{
                  height: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  filter: filter,
                }}
              />
            </div>
            <div className="w-full">
              <div className="mt-4 flex w-full flex-row  justify-around border-b border-gray-500">
                <span
                  onClick={() => {
                    setTab("filters");
                    if (filterImgRef.current) {
                      filterImgRef.current.style.filter = "";
                    }
                  }}
                  className={`w-[50%] ${tab === "filters" ? "border-b border-gray-900 text-blue-600" : "text-blue-200"} py-3 text-center text-sm `}
                >
                  Filters
                </span>
                <span
                  onClick={() => {
                    setTab("adjustment");
                    if (filterImgRef.current) {
                      filterImgRef.current.style.filter = filter;
                    }
                    setClassName("");
                  }}
                  className={`w-[50%]  py-3 text-center text-sm ${tab === "adjustment" ? "border-b border-gray-900 text-blue-600" : "text-blue-200"}`}
                >
                  Adjustment
                </span>
              </div>
              {tab === "filters" ? (
                <div>
                  <select
                    className="my-3 w-full border border-gray-400 p-3 text-center"
                    onChange={(e) => setClassName(e.target.value)}
                  >
                    {Filters.map((className) => {
                      return (
                        <option key={className.class} value={className.class}>
                          {className.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : (
                <div>
                  {[
                    "brightness",
                    "contrast",
                    "grayscale",
                    "hueRotate",
                    "invert",
                    "saturate",
                    "sepia",
                  ].map((filter) => {
                    return (
                      <div className="flex w-full flex-col p-2" key={filter}>
                        <span>
                          {filter[0].toUpperCase() + filter.slice(1)}
                          <span className="ml-5">{customFilter[filter]}</span>
                        </span>
                        <input
                          type="range"
                          name={filter}
                          min="0"
                          max="1000"
                          onChange={(e) => {
                            let a = parseInt(e.target.value);
                            let b = a / 1000;
                            const string = b.toString();
                            let value =
                              string.length === 1 ? string : string.slice(1);
                            setCustomFilter({
                              ...customFilter,
                              [e.target.name]:
                                e.target.value === "0"
                                  ? "0"
                                  : filter === "hueRotate"
                                    ? e.target.value
                                    : value,
                            });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewPost;
