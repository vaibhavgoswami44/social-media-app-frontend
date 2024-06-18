import PropTypes from "prop-types";
import Filters from "../../Components/utils";
import { useEffect, useState } from "react";
import "../../../../styles/filters.css";

const FilterImg = ({
  setShowFilterImg,
  setShowCropImg,
  setShowSelectImg,
  showFilterImg,
  croppedImg,
  filterImgRef,
  addNewPost,
}) => {
  const [class_name, setClassName] = useState("");
  const [tab, setTab] = useState("filters");
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

  useEffect(() => {
    if (filterImgRef.current) {
      filterImgRef.current.style.filter = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setClassName("");
    setFilter(
      `brightness(${customFilter.brightness}) contrast(${customFilter.contrast}) grayscale(${customFilter.grayscale}) hue-rotate(${customFilter.hueRotate}deg) invert(${customFilter.invert}) saturate(${customFilter.saturate}) sepia(${customFilter.sepia})`,
    );
  }, [customFilter]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const img = document.getElementById("img");
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, []);
  const applyFilters = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    if (tab === "filters") {
      let a = window.getComputedStyle(canvas);
      let b = a.getPropertyValue("filter");
      ctx.filter = b;
    } else {
      ctx.filter = filter;
    }
    ctx.drawImage(document.getElementById("img"), 0, 0);
    ctx.filter = "none"; // Reset filter for future changes
  };

  return (
    <>
      <img className="hidden" id="img" src={croppedImg} />
      {showFilterImg && (
        <div className="relative flex h-[60vh] w-full flex-col mt-[8vh] md:mt-0 ">
          <div className="flex w-full justify-between  p-5">
            <span
              className="cursor-pointer"
              title="back"
              onClick={() => {
                setShowCropImg(true);
                setShowSelectImg(false);
                setShowFilterImg(false);
              }}
            >
              <i className=" fa-solid fa-arrow-left cursor-pointer"></i> Back
            </span>
            <span className="">Apply Filter On Your Image</span>
            <span
              className="cursor-pointer"
              title="Post"
              onClick={async () => {
                applyFilters();
                const canvas = document.getElementById("canvas");
                const blob = await new Promise((resolve) =>
                  canvas.toBlob(resolve),
                );
                setShowCropImg(false);
                setShowSelectImg(false);
                setShowFilterImg(true);
                addNewPost(blob);
              }}
            >
              Post <i className=" fa-solid fa-arrow-right  cursor-pointer"></i>
            </span>
          </div>
          <div className="flex h-[80%] w-full flex-col  pb-20 md:flex-row">
            <div className="md:flex md:w-[50%] md:flex-col md:items-center md:justify-center">
              <div className="flex h-[30vh] w-[80%] items-center justify-center border ">
                <canvas
                  id="canvas"
                  ref={filterImgRef}
                  className={`${class_name} `}
                  style={{
                    height: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: filter,
                  }}
                />
              </div>
              <div className="flex w-full flex-1 flex-col">
                <button
                  onClick={() => {
                    applyFilters();
                    const canvas = document.getElementById("canvas");
                    var link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png"); // or 'image/jpeg'
                    link.download = "image.png"; //
                    link.click();
                  }}
                  className="mt-3  cursor-pointer bg-blue-600 p-3 text-center text-white"
                >
                  Save Image To Gallery
                </button>
              </div>
            </div>
            <div className="h-full w-full md:w-[50%] ">
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
                <div className="h-full overflow-y-scroll">
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
                          className={`${filter === "sepia" ? "mb-16 md:mb-0" : ""}`}
                          type="range"
                          name={filter}
                          min="0"
                          max="1000"
                          defaultValue={customFilter[filter] * 1000}
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
    </>
  );
};

FilterImg.propTypes = {
  showFilterImg: PropTypes.bool,
  filterImgRef: PropTypes.object,
  croppedImg: PropTypes.string,
  setShowFilterImg: PropTypes.func,
  setShowCropImg: PropTypes.func,
  setShowSelectImg: PropTypes.func,
  addNewPost: PropTypes.func,
};

export default FilterImg;
