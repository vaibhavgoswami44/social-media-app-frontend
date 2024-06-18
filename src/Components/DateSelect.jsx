import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const DateSelect = ({ setDate, setBirthdayError }) => {
  var todayDate = new Date().toISOString().split("T")[0];
  const [d, setD] = useState(todayDate);
  const handleChange = (e) => {
    setDate(e.target.value);
    setD(e.target.value);
    setBirthdayError(e.target.value > todayDate);
  };
  useEffect(() => {
    setDate(d);
  }, []);
  return (
    <>
      <div className="flex  w-full justify-center ">
        <input
          className="m-0 w-full  rounded-lg border bg-gray-50   px-2 py-3 focus:border-neutral-600 focus:ring-neutral-600"
          type="date"
          value={d}
          onChange={handleChange}
          max={todayDate}
        />
      </div>
    </>
  );
};

DateSelect.propTypes = {
  setDate: PropTypes.func,
  setBirthdayError: PropTypes.func,
};

export default DateSelect;
