import Loader from "../../../../Components/Loader";
import { useContext, useState } from "react";
import userContext from "../../../../Context/auth/userContext";

const DeleteAccount = () => {
  const [verifyUserModal, setVerifyUserModal] = useState(false);
  const { verifyUserPassword, userDetails, deleteuser } =
    useContext(userContext);
  const [password, setPassword] = useState({
    password: "",
  });
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const verifyUser = async () => {
    setLoader(true);
    const data = await verifyUserPassword(password.password);
    setLoader(false);
    if (data) {
      setDeleteUserModal(true);
      setVerifyUserModal(false);
    }
  };
  const deleteAccount = async () => {
    setLoader(true);
    const data = await deleteuser();
    setLoader(false);
    if (data) {
      setDeleteUserModal(false);
    }
  };
  return (
    <>
      {verifyUserModal && (
        <div className="fixed inset-0  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                Verify it&apos;s you
                <i
                  onClick={() => {
                    setVerifyUserModal(false);
                  }}
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
                  onChange={(e) =>
                    setPassword({
                      ...password,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <hr />

              <button
                onClick={() => {
                  verifyUser();
                }}
                className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white "
              >
                {loader ? (
                  <>
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[30px] "} />
                    </div>
                  </>
                ) : (
                  " Verify"
                )}
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => {
              setVerifyUserModal(false);
            }}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}
      {deleteUserModal && (
        <div className="fixed inset-0  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                Confirm
                <i
                  onClick={() => {
                    setDeleteUserModal(false);
                  }}
                  className=" fa-solid fa-xmark absolute right-0 cursor-pointer"
                ></i>
              </div>
              <hr />

              <p className="my-5 text-sm text-gray-500">
                If you continue, your profile and account details will be
                deleted. Your account will not visible on Real Talk.
              </p>

              <hr />

              <button
                onClick={() => {
                  deleteAccount();
                }}
                className="mt-6 rounded bg-red-500 px-4 py-2 font-bold text-white "
              >
                {loader ? (
                  <>
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[30px] "} />
                    </div>
                  </>
                ) : (
                  `Delete @${userDetails.userName}`
                )}
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => {
              setDeleteUserModal(false);
            }}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}

      <div className="flex w-full flex-col items-center justify-center px-4">
        <div className="flex w-full flex-col md:w-[50%]">
          <span className="mb-5 text-xl font-bold text-[red]">
            Delete your account
          </span>
          <hr />
        </div>
        <button
          onClick={() => {
            setVerifyUserModal(true);
          }}
          className="font-dark w-[50vw] cursor-pointer  rounded bg-[#3ba3f3] p-2 text-sm text-white md:w-[20vw]"
        >
          Delete @{userDetails.userName}
        </button>
      </div>
    </>
  );
};

export default DeleteAccount;
