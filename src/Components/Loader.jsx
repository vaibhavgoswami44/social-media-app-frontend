import "../index.css";
import LoaderSvg from "../assets/svg/Loader.svg";
import PropTypes from "prop-types";

const Loader = ({ width }) => {
  return <img className={`animate-spin-custom ${width} `} alt="Loading Please Wait" src={LoaderSvg} />;
};

Loader.propTypes = {
  width: PropTypes.string,
};

export default Loader;
