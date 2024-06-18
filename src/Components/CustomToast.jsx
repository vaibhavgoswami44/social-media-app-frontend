import PropTypes from "prop-types";
import defaultProfilePicture from "../assets/Images/default-profile-picture.png";
import { Link } from "react-router-dom";

const CustomToast = ({ img, msg, post, userName, link }) => {
  return (
    <Link to={link ? link : ""} className="relative flex flex-row items-center">
      <img
        src={img ? img : defaultProfilePicture}
        style={{
          backgroundColor: "black",
          height: "50px",
          width: "50px",
          objectFit: "contain",
          borderRadius: "50%",
        }}
      />
      <span className="ms-1">
        <span className="font-bold">{userName ? userName : ""}</span> {msg}
      </span>
      {post && (
        <img
          src={post}
          className="absolute right-1"
          style={{
            backgroundColor: "black",
            height: "50px",
            width: "50px",
            objectFit: "contain",
            borderRadius: "10px",
          }}
        />
      )}
    </Link>
  );
};

CustomToast.propTypes = {
  img: PropTypes.string,
  link: PropTypes.string,
  msg: PropTypes.string,
  post: PropTypes.string,
  userName: PropTypes.string,
};

export default CustomToast;
