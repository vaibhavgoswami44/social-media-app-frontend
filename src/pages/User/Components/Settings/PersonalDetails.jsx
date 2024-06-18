import { useState } from "react";
import DateSelect from "../../../../Components/DateSelect";

const PersonalDetails = () => {
  const [date, setDate] = useState("");
  const [birthdayError, setBirthdayError] = useState(false);
  const [personalDetailsModal, setPersonalDetailsModal] = useState({
    modal: false,
    modalBody: "",
  });
  const [verifyUserModal, setVerifyUserModal] = useState(false);
  return (
    <>
      {verifyUserModal && (
        <div className="fixed inset-0 z-[500]  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                Verify it&apos;s you
                <i
                  onClick={() => setVerifyUserModal(false)}
                  className=" fa-solid fa-xmark absolute right-0 cursor-pointer"
                ></i>
              </div>
              <hr />

              <div className="my-4 flex flex-col">
                <label>Enter Your Password</label>
                <input
                  className="rounded border border-gray-400  bg-gray-200 p-2 outline-black focus:outline"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <hr />
              <button
                onClick={() => {
                  setVerifyUserModal(false);
                  setPersonalDetailsModal({
                    ...personalDetailsModal,
                    modal: true,
                  });
                }}
                className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white "
              >
                Verify
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setVerifyUserModal(false)}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}
      {personalDetailsModal.modal && (
        <div className="fixed inset-0 z-[500]  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                {personalDetailsModal.modalBody === "email" && (
                  <>Enter New Email</>
                )}
                {personalDetailsModal.modalBody === "birthday" && (
                  <>Select New Birthday</>
                )}
                <i
                  onClick={() => {
                    setVerifyUserModal(false);
                    setPersonalDetailsModal({
                      modal: false,
                      modalBody: "",
                    });
                  }}
                  className=" fa-solid fa-xmark absolute right-0 cursor-pointer"
                ></i>
              </div>
              <hr />

              <div className="my-4 flex flex-col">
                <label>
                  {personalDetailsModal.modalBody === "email" && <> Email</>}
                  {personalDetailsModal.modalBody === "birthday" && (
                    <> Birthday</>
                  )}
                </label>
                {personalDetailsModal.modalBody === "email" && (
                  <>
                    <input
                      className="rounded border border-gray-400  bg-gray-200 p-2 outline-black focus:outline"
                      type="email"
                      placeholder="email"
                    />
                  </>
                )}
                {personalDetailsModal.modalBody === "birthday" && (
                  <>
                    <DateSelect
                      setBirthdayError={setBirthdayError}
                      setDate={setDate}
                    />
                  </>
                )}
              </div>

              <hr />

              <button
                onClick={() => {
                  setVerifyUserModal(false);
                  setPersonalDetailsModal({
                    ...personalDetailsModal,
                    modal: true,
                  });
                }}
                className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white "
              >
                Verify
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => {
              setVerifyUserModal(false);
              setPersonalDetailsModal({
                modal: false,
                modalBody: "",
              });
            }}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}

      <div className="flex w-full justify-center px-4">
        <div className="flex w-full flex-col md:w-[50%]">
          <span className="text-xl font-bold">Personal Details</span>
          <div className="mt-3 flex w-full flex-col rounded-md bg-white  shadow-xl">
            <div className=" relative flex w-full flex-col rounded-t-md border-b border-gray-300 bg-white px-2 py-3 hover:bg-gray-100 ">
              <span className="text-sm font-medium">Contact info</span>
              <span className="text-sm">Email@gmail.com</span>
              <button
                onClick={() => {
                  setVerifyUserModal(true);
                  setPersonalDetailsModal({ modal: false, modalBody: "email" });
                }}
                className="absolute right-2 top-3 cursor-pointer bg-white p-2 shadow-lg hover:bg-gray-100"
              >
                Update Email
              </button>
            </div>
            <div className="relative flex w-full  flex-col rounded-b-md bg-white px-2 py-3 hover:bg-gray-100 ">
              <span className="text-sm font-medium">Birthday</span>
              <span className="text-sm">2024/03/01</span>
              <button
                onClick={() => {
                  setVerifyUserModal(true);
                  setPersonalDetailsModal({
                    modal: false,
                    modalBody: "birthday",
                  });
                }}
                className="absolute right-2 top-3 cursor-pointer bg-white p-2 shadow-lg hover:bg-gray-100"
              >
                Update Birthday
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
