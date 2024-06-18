import { useCallback, useEffect, useState } from "react";
import "../../index.css";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import socket from "../../Socket/Socket";
import defaultProfilePicture from "../../assets/Images/default-profile-picture.png";
import Loader from "../../Components/Loader";
import PropTypes from "prop-types";

const Search = ({ link }) => {
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("start typing");

  const search = () => {
    if (searchText.length > 1) {
      setLoader(true);
      setMsg("");

      socket.emit("searchUsers", searchText, (response) => {
        setLoader(false);
        if (response.status) {
          setUsers(response.users);
        } else {
          setMsg("User Not Found");
        }
      });
    }
    if (searchText.length <= 1) {
      setMsg("start typing");
    }
  };
  const delayedQuery = useCallback(debounce(search, 500), [searchText]);

  useEffect(() => {
    delayedQuery();

    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [searchText, delayedQuery]);
  return (
    <>
      <div className=" flex w-full justify-center md:mt-3 ">
        <div className="w-full border-b border-gray-100 md:w-[50%]">
          <div className=" flex flex-col p-3">
            <span className=" text-lg font-bold">Search</span>
            <div className="relative m-3 flex flex-col ">
              <input
                className={`search-input w-full rounded bg-gray-100 ${searchText.length > 0 ? "p-3" : " py-3 pl-8"} focus:p-3 focus:outline-none`}
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {!searchText.length > 0 && (
                <div className="search-input-icon absolute flex h-full cursor-pointer items-center pl-2  ">
                  <i className="fa-solid fa-magnifying-glass text-gray-400 "></i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full flex-col items-center justify-center ">
        {loader ? (
          <div className="flex w-full items-center justify-center py-2">
            <Loader width={"w-[20px]"} />
          </div>
        ) : msg ? (
          <div className="flex w-full items-center justify-center py-2">
            {msg}
          </div>
        ) : (
          users.map((e, i) => {
            return (
              <Link
                to={`${link ? link : "/profile"}/${e.username}`}
                key={i}
                className="my-3 flex w-[90vw] cursor-pointer items-center rounded  border border-gray-100 p-3 shadow md:w-[20vw]"
              >
                <img
                  className="h-[30px] w-[30px] rounded-sm"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    backgroundColor: "black",
                    objectFit: "contain",
                  }}
                  src={e.photo ? e.photo : defaultProfilePicture}
                />
                <span className="ml-3">{e.username}</span>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
};

Search.propTypes = {
  link: PropTypes.string,
};

export default Search;
