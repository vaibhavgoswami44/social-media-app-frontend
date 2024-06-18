import DateSelect from "../../Components/DateSelect";
import EmailIcon from "../../assets/Images/email-icon.png";
import CakeIcon from "../../assets/Images/cake-icon.png";
import Google from "../../assets/svg/google-color-icon.svg";
import { Link } from "react-router-dom";
import "../../index.css";
import { useCallback, useContext, useEffect, useState } from "react";
import socket from "../../Socket/Socket.js";
import Loader from "../../Components/Loader";
import { debounce } from "lodash";
import userContext from "../../Context/auth/userContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const SignUp = () => {
  let userDetails =
    Cookies.get("user") != undefined ? JSON.parse(Cookies.get("user")) : null;
  let page =
    Cookies.get("page") != undefined ? JSON.parse(Cookies.get("page")) : null;
  const { verifyEmail, registerUser, checkEmail } = useContext(userContext);
  const [formState, setFormState] = useState({
    showFormDiv: page ? page.showFormDiv : true,
    showBirthdayDiv: page ? page.showBirthdayDiv : false,
    showEmailDiv: page ? page.showEmailDiv : false,
  });
  const [showPassword, setShowPassword] = useState("password");
  const [shakeElement, setShakeElement] = useState(false);
  const [loader, setLoader] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [otp, setOtp] = useState(null);

  const [credential, setCredential] = useState({
    email: userDetails ? userDetails.email : "",
    firstName: userDetails ? userDetails.firstName : "",
    lastName: userDetails ? userDetails.lastName : "",
    userName: userDetails ? userDetails.userName : "",
    password: userDetails ? userDetails.password : "",
    bDate: userDetails ? userDetails.bDate : "",
  });

  const [credentialCondition, setCredentialCondition] = useState({
    email: { status: false, msg: "", theme: "" },
    firstName: { status: false, msg: "", theme: "" },
    lastName: { status: false, msg: "", theme: "" },
    userName: { status: false, msg: "", theme: "" },
    password: { status: false, msg: "", theme: "" },
    bDate: { status: false, msg: "", theme: "" },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredential((prevCredential) => ({
      ...prevCredential,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const updateQuery = () => {
    const regex = /^[a-zA-Z0-9_.]*$/;

    if (!regex.test(credential.userName)) {
      const invalidChars = credential.userName
        .split("")
        .filter((char) => !regex.test(char));
      validateField(
        "userName",
        !regex.test(credential.userName),
        `${invalidChars} characters are not allowed`,
      );
    } else {
      if (credential.userName.length >= 5) {
        setLoader(true);
        socket.emit("checkUserName", credential.userName, (response) => {
          setLoader(false);
          if (response.available) {
            // Username is available
            setCredentialCondition((prevCondition) => ({
              ...prevCondition,
              userName: {
                status: true,
                msg: response.message,
                theme: "green",
              },
            }));
          } else {
            // Username is not available
            setCredentialCondition((prevCondition) => ({
              ...prevCondition,
              userName: {
                status: true,
                msg: response.message,
                theme: "red",
              },
            }));
          }
        });
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedQuery = useCallback(debounce(updateQuery, 500), [
    credential.userName,
  ]);

  const validateInput = (name, value) => {
    const emailRegex = /@.*\./;

    switch (name) {
      case "firstName":
      case "lastName":
        validateField(
          name,
          value.length < 3,
          `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } should contain at least 3 characters`,
        );
        break;
      case "userName":
        validateField(
          name,
          value.length < 5,
          `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } should contain at least 5 characters`,
        );
        break;
      case "email":
        validateField(name, !emailRegex.test(value), "Invalid Email");
        break;
      case "password":
        validateField(
          name,
          value.length < 8,
          `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } should contain at least 8 characters`,
        );
        break;
      default:
        break;
    }
  };

  const validateField = (name, status, msg) => {
    setCredentialCondition((prevCondition) => ({
      ...prevCondition,
      [name]: { status, msg, theme: "red" },
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /@.*\./;
    setLoader(true);
    const email = await checkEmail(credential.email);
    setLoader(false);

    if (
      !(
        credential.firstName.length < 3 ||
        !emailRegex.test(credential.email) ||
        credential.userName.length < 5 ||
        credential.password.length < 8 ||
        credentialCondition.userName.theme === "red"
      ) &&
      email
    ) {
      const cookieValue = JSON.stringify(credential);
      const pageValues = JSON.stringify({
        showBirthdayDiv: true,
        showFormDiv: false,
        showEmailDiv: false,
      });
      Cookies.set("user", cookieValue, { expires: 1 });
      Cookies.set("page", pageValues, { expires: 1 });
      setFormState({
        showBirthdayDiv: true,
        showFormDiv: false,
        showEmailDiv: false,
      });
    } else {
      setShakeElement(true);
      setTimeout(() => {
        setShakeElement(false);
      }, 1000);
    }
  };

  const getOtp = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!loader) {
      if (
        !(
          credential.bDate >= today &&
          credentialCondition.bDate.theme === "red" &&
          credentialCondition.email.theme === "red" &&
          credentialCondition.firstName.theme === "red" &&
          credentialCondition.lastName.theme === "red" &&
          credentialCondition.password.theme === "red" &&
          credentialCondition.userName.theme === "red"
        )
      ) {
        setLoader(true);

        var response = await verifyEmail(credential);

        const cookieValue = JSON.stringify(credential);
        Cookies.set("user", cookieValue, { expires: 1 });

        setLoader(false);
        if (response && response.status) {
          setFormState({
            showBirthdayDiv: false,
            showFormDiv: false,
            showEmailDiv: true,
          });
          const cookieValue = JSON.stringify(credential);
          const pageValues = JSON.stringify({
            showBirthdayDiv: false,
            showFormDiv: false,
            showEmailDiv: true,
          });
          Cookies.set("user", cookieValue, { expires: 1 });
          Cookies.set("page", pageValues, { expires: 1 });
          toast.success(`Confirmation code Send to ${credential.email}`);
        }
      } else {
        setShakeElement(true);
        setTimeout(() => {
          setShakeElement(false);
        }, 1000);
      }
    }
  };

  const handleBirthdaySubmit = async (e) => {
    e.preventDefault();
    getOtp();
  };

  const register = async (event) => {
    event.preventDefault();
    setSignUp(true);
    await registerUser(otp);
    setSignUp(false);
  };

  const setDate = (date) => {
    setCredential((prevCredential) => ({ ...prevCredential, bDate: date }));
  };

  const setBirthdayError = (status) => {
    setCredentialCondition((prevCredential) => ({
      ...prevCredential,
      bDate: { status, msg: "invalid date", theme: "red" },
    }));
  };

  useEffect(() => {
    delayedQuery();

    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [credential.userName, delayedQuery]);
  useEffect(() => {
    if (userDetails && page) {
      toast.success("Your details restored");
    }
    if (userDetails && page && formState.showEmailDiv) {
      getOtp();
    }
  }, []);
  return (
    <div className="m-5 flex items-center justify-center">
      <div className="w-[75%] sm:w-[50%] xl:w-[25%] ">
        {formState.showFormDiv && (
          <form
            onSubmit={handleFormSubmit}
            className="flex w-full flex-col items-center border border-gray-300 p-8 "
          >
            <img
              className="my-2"
              src="/app-logo.png"
              width="500"
              alt="App Logo"
            />
            <span className="text-center font-bold text-gray-600">
              Sign up to see photos and videos from your friends.
            </span>

            {["email", "firstName", "lastName", "userName", "password"].map(
              (field) => (
                <div
                  key={field}
                  className="relative my-5  flex w-full flex-col items-center justify-center"
                >
                  <input
                    type={
                      field === "password"
                        ? showPassword
                        : field === "email"
                          ? "email"
                          : "text"
                    }
                    name={field}
                    id={field}
                    value={credential[field]}
                    onChange={handleInputChange}
                    className="m-0 w-full  rounded-lg border bg-gray-50   px-2 py-3 focus:border-neutral-600 focus:ring-neutral-600 "
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required
                  />
                  {field === "password" && (
                    <div
                      className="absolute right-2 cursor-pointer"
                      onClick={() =>
                        setShowPassword(
                          showPassword === "password" ? "text" : "password",
                        )
                      }
                    >
                      {showPassword === "password" ? (
                        <i className="fa-regular fa-eye text-gray-400"></i>
                      ) : (
                        <i className="fa-regular fa-eye-slash text-gray-400"></i>
                      )}
                    </div>
                  )}
                  {field === "userName" && loader && (
                    <>
                      <div className="absolute right-1">
                        <Loader width={"w-[20px]"} />
                      </div>
                    </>
                  )}
                  {field === "userName" &&
                    credentialCondition[`${field}`].theme === "green" && (
                      <>
                        <div className="absolute -right-5">
                          <i className="fa-solid fa-check  text-green-900"></i>
                        </div>
                      </>
                    )}
                  <div
                    className={`input-valadition-msg absolute -bottom-4 -left-2 ${credentialCondition[`${field}`].theme === "red" && shakeElement && "animation-shake"}`}
                  >
                    {credentialCondition[`${field}`].status && (
                      <span
                        className="ml-2 block p-0  text-[12px] "
                        style={{
                          color: credentialCondition[`${field}`].theme,
                        }}
                      >
                        *{credentialCondition[`${field}`].msg}
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}

            <button
              type="submit"
              className="my-4 w-full rounded-lg border bg-blue-500 px-2 py-3 font-bold text-white"
            >
              {loader ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <Loader width={"w-[20px]"} />
                  </div>
                </>
              ) : (
                "Sign up"
              )}
            </button>

            <div className="mt-3 flex w-full">
              <hr className="border-1 mx-4 mt-3 w-full border-gray-300" />
              <span className="font-normal text-gray-400"> OR</span>
              <hr className="border-1 mx-4 mt-3 w-full border-gray-300" />
            </div>

            <div className="mt-3 flex cursor-pointer">
              <img src={Google} width="20" alt="Google Icon" />
              <span className="ml-2"> Sign up with Google</span>
            </div>
          </form>
        )}

        {formState.showBirthdayDiv && (
          <form
            onSubmit={handleBirthdaySubmit}
            className="flex flex-col items-center border border-gray-300 p-8 "
          >
            <img src={CakeIcon} className="w-[40%]" alt="" />
            <span className="mb-3">Add your Birthday</span>
            <div className="relative w-full">
              <div className="mb-4 w-full">
                <DateSelect
                  setDate={setDate}
                  setBirthdayError={setBirthdayError}
                />
              </div>
              {credentialCondition.bDate.status && (
                <div
                  className={`absolute -bottom-1 left-6 ${credentialCondition.bDate.theme === "red" && shakeElement && "animation-shake"}`}
                >
                  <span className="ml-2 text-red-500">*Invalid Date</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className=" my-1 mt-4 w-full rounded-lg border bg-blue-500 px-2 py-3 font-bold text-white"
            >
              {loader ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <Loader width={"w-[20px]"} />
                  </div>
                </>
              ) : (
                "Next"
              )}
            </button>
            <button
              className=" bg-text-white my-1 w-full px-2 py-3 font-bold text-blue-500"
              onClick={() =>
                setFormState({
                  showBirthdayDiv: false,
                  showFormDiv: true,
                  showEmailDiv: false,
                })
              }
            >
              Go Back
            </button>
          </form>
        )}

        {formState.showEmailDiv && (
          <div className="flex flex-col items-center border border-gray-300 p-8">
            <img src={EmailIcon} className="w-[40%]" alt="" />
            <span className="mb-3">Enter Confirmation Code</span>
            <span className="text-center font-semibold">
              Enter the confirmation code we sent to {credential.email}.
            </span>
            <form className="w-full" onSubmit={register}>
              <input
                type="text"
                name="confirmCode"
                id="confirmCode"
                className="'border  my-4 w-full rounded-lg border bg-gray-50 px-2 py-3 focus:border-neutral-600 focus:ring-neutral-600 "
                placeholder="Confirmation Code"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className=" my-1 mt-4 w-full rounded-lg border bg-blue-500 px-2 py-3 font-bold text-white"
              >
                {signUp ? (
                  <>
                    <div className="flex w-full items-center justify-center">
                      <Loader width={"w-[20px]"} />
                    </div>
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </form>
            <button
              className=" my-1 mt-4 w-full rounded-lg border bg-blue-500 px-2 py-3 font-bold text-white"
              onClick={getOtp}
            >
              {loader ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <Loader width={"w-[20px]"} />
                  </div>
                </>
              ) : (
                "Resend Code"
              )}
            </button>
            <button
              className=" bg-text-white my-1 w-full px-2 py-3 font-bold text-blue-500"
              onClick={() =>
                setFormState({
                  showBirthdayDiv: true,
                  showFormDiv: false,
                  showEmailDiv: false,
                })
              }
            >
              Go Back
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-col items-center justify-center border border-gray-300 p-5">
          <span>
            Have an account?
            <span className="cursor-pointer font-medium text-blue-500">
              <Link to="/login"> Log in</Link>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
