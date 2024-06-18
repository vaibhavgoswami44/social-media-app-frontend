import PropTypes from "prop-types";
import Search from "../Search";

const NewChatModal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-[899] h-full w-[100vw] ">
            <div
              title="close"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-20 z-[999] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[50%] bg-white hover:bg-gray-200"
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="flex  h-full w-[100vw] items-center justify-center  ">
              <div className="z-[899] max-h-[70%]  w-[100vw] rounded-lg  bg-white p-8 md:w-[50%]">
                <Search link={"/message"} />
              </div>
            </div>

            {/* Modal Overlay */}
            <div
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black opacity-25"
            ></div>
          </div>
        </>
      )}
    </>
  );
};

NewChatModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};

export default NewChatModal;
