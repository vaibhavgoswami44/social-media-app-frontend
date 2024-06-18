import { useContext, useEffect } from "react";
import "../index.css";
import alertContext from "../Context/alert/alertContext";
const Alert = () => {
  const { alertState, setAlertState } = useContext(alertContext);
  let timer;
  useEffect(() => {
    //eslint-disable-next-line
    timer = setTimeout(() => {
      setAlertState({ ...alertState, status: false });
    }, 6000);

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [alertState.status]); // add alertState.status as a dependency to avoid unnecessary rerenders

  const dismissAlert = () => {
    setAlertState({ ...alertState, status: false });
    clearTimeout(timer);
  };

  return (
    <>
      <div
        className={`fixed right-0  top-0 z-[999] m-5 w-[90vw] shadow-lg md:w-[40vw]  xl:w-[20vw] ${alertState.status ? "translate-x-0 translate-y-0" : "-translate-y-[110vh] md:-translate-y-0 md:translate-x-[60vw]  xl:translate-x-[40vw]"}   transition-transform duration-1000 ease-in-out`}
      >
        <div
          className={` rounded-md p-0 ${alertState.theme ? "bg-[#d4edda]" : "bg-[#f8d7da]"}`}
        >
          <div className="flex justify-between p-3">
            <span
              className={`${alertState.theme ? "text-[#155724]" : "text-[#721c24]"}`}
            >
              {alertState.msg}
            </span>
            <div>
              <span className="cursor-pointer" onClick={dismissAlert}>
                <i
                  className={`fa-regular fa-rectangle-xmark  ${alertState.theme ? "text-[#155724]" : "text-[#721c24]"} `}
                ></i>
              </span>
            </div>
          </div>
          {alertState.status && (
            <div
              className={`progress-bar absolute bottom-[1px]   border ${alertState.theme ? "border-green-900" : "border-red-900"} `}
            ></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Alert;
