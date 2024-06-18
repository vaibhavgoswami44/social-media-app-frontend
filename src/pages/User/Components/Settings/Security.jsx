import { useContext, useState } from "react";
import userContext from "../../../../Context/auth/userContext";
import { toast } from "react-toastify";
import Loader from "../../../../Components/Loader";

const Security = () => {
  const [verifyUserModal, setVerifyUserModal] = useState(false);
  const [newPasswordModal, setNewPasswordModal] = useState(false);
  const [newEmailModal, setNewEmailModal] = useState(false);
  const [state, setState] = useState(true);
  const { userDetails, verifyUserPassword, updateUserEmailPassword } =
    useContext(userContext);
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [loader, setLoader] = useState(false);
  const verifyUser = async () => {
    setLoader(true);
    const data = await verifyUserPassword(password.password);
    setLoader(false);
    if (data.status) {
      if (state) {
        setVerifyUserModal(false);
        setNewPasswordModal(true);
      } else {
        setVerifyUserModal(false);
        setNewEmailModal(true);
      }
    }
  };

  const updateUserCredential = async () => {
    if (!state) {
      setLoader(true);
      const data = await updateUserEmailPassword({
        email: password.email,
      });
      setLoader(false);
      if (data.status) {
        setNewPasswordModal(false);
        setNewEmailModal(false);
        setPassword({
          password: "",
          confirmPassword: "",
          email: "",
        });
      }
      return;
    }
    if (password.password === password.confirmPassword) {
      setLoader(true);
      const data = await updateUserEmailPassword({
        password: password.password,
      });
      setLoader(false);
      if (data.status) {
        setNewPasswordModal(false);
        setPassword({
          password: "",
          confirmPassword: "",
          email: "",
        });
      }
    } else {
      toast.warn("password not match");
    }
  };
  return (
    <>
      <div className="flex w-full justify-center px-4">
        <div className="flex w-full flex-col md:w-[50%]">
          <span className="text-xl  font-bold">Password And Security</span>
          <span className="my-3">
            Password Last Changed {userDetails.passwordChangedDate}
          </span>
          <button
            onClick={() => {
              setVerifyUserModal(true);
              setState(true);
            }}
            className="mt-3 w-[50%] rounded bg-blue-400 p-2 font-bold text-white"
          >
            Change Password
          </button>
          <button
            onClick={() => {
              setVerifyUserModal(true);
              setState(false);
            }}
            className="mt-3 w-[50%] rounded bg-blue-400 p-2 font-bold text-white"
          >
            Change Email
          </button>
        </div>
      </div>

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
                    setNewPasswordModal(false);
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
              setNewPasswordModal(false);
            }}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}

      {newPasswordModal && (
        <div className="fixed inset-0  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                Set New Password
                <i
                  onClick={() => setNewPasswordModal(false)}
                  className=" fa-solid fa-xmark absolute right-0 cursor-pointer"
                ></i>
              </div>
              <hr />

              <div className="my-4 flex flex-col">
                <div className="my-3 flex flex-col">
                  <label>Enter Your New Password</label>
                  <input
                    className="rounded border border-gray-400  bg-gray-200 p-2 outline-black focus:outline"
                    type="password"
                    placeholder="New Password"
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="my-3 flex flex-col">
                  <label>Confirm Your New Password</label>
                  <input
                    className="rounded border border-gray-400  bg-gray-200 p-2 outline-black focus:outline"
                    type="password"
                    placeholder="Confirm New Password"
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <hr />
              {/* Close Button */}
              <button
                onClick={() => updateUserCredential()}
                className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white "
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setNewPasswordModal(false)}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}
      {newEmailModal && (
        <div className="fixed inset-0  overflow-y-auto">
          <div className="z-[999] flex min-h-screen items-center justify-center p-4">
            <div className="z-[999] rounded-lg bg-white p-4 md:min-h-[20vh] md:min-w-[20vw] md:max-w-[50%]">
              {/* Modal Content */}
              <div className="relative font-bold">
                Set New Email
                <i
                  onClick={() => setNewEmailModal(false)}
                  className=" fa-solid fa-xmark absolute right-0 cursor-pointer"
                ></i>
              </div>
              <hr />

              <div className="my-4 flex flex-col">
                <div className="my-3 flex flex-col">
                  <label>Enter Your New Email</label>
                  <input
                    className="rounded border border-gray-400  bg-gray-200 p-2 outline-black focus:outline"
                    type="email"
                    placeholder="New Email"
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <hr />
              {/* Close Button */}
              <button
                onClick={() => updateUserCredential()}
                className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white "
              >
                Update Email
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={() => setNewEmailModal(false)}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}
    </>
  );
};

export default Security;
