import { useContext, useState } from "react";
import Google from "../../assets/svg/google-color-icon.svg";
import { Link } from "react-router-dom";
import userContext from "../../Context/auth/userContext";
import Loader from "../../Components/Loader";

const Login = () => {
  const { login } = useContext(userContext);
  const [loader, setLoader] = useState(false);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState("password");
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    await login(credential);
    setLoader(false);
  };

  return (
    <>
      <div className=" mt-10  flex items-center justify-center ">
        <div className="login-page-div relative mr-5 hidden xl:block ">
          <div className="dynamic-img-div"></div>
        </div>
        <div className="w-[75%] sm:w-[50%] xl:w-[25%] ">
          <form
            onSubmit={handleLogin}
            className=" flex flex-col items-center border border-gray-300 p-8  "
          >
            <img src="app-logo.png" width="500" />
            {["email", "password"].map((field) => (
              <div key={field} className="relative w-full">
                <input
                  type={field === "password" ? showPassword : "email"}
                  name={field}
                  id={field}
                  value={credential[field]}
                  onChange={(e) => {
                    const name = e.target.name;
                    const value = e.target.value;
                    setCredential({ ...credential, [name]: value });
                  }}
                  className="m-0 mt-3  w-full rounded-lg border bg-gray-50  px-2 py-3 focus:border-neutral-600 focus:ring-neutral-600 "
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                />
                {field === "password" && (
                  <div
                    className="absolute right-2 top-7 cursor-pointer"
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
              </div>
            ))}
            <button
              className=" my-4 w-full rounded-lg border bg-blue-500 px-2 py-3 font-bold text-white"
              disabled={false}
              type="submit"
            >
              {loader ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <Loader width={"w-[20px]"} />
                  </div>
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="flex w-full items-center">
              <hr className="mr-4 w-full border-t-2 border-gray-200" />
              <span className="text-center font-bold text-gray-500">OR</span>
              <hr className="ml-4 w-full border-t-2 border-gray-200" />
            </div>
            <div className="mt-3 flex cursor-pointer">
              <img src={Google} width="20" />
              <span className="ml-2"> Login with google</span>
            </div>
            <span className="mt-3 cursor-pointer font-light">
              Forgot password?
            </span>
          </form>
          <div className="my-4 border border-gray-300 p-5  ">
            <p className="text-center text-slate-950">
              Don&apos;t have an account?
              <span className="cursor-pointer font-bold text-blue-500 underline">
                <Link to="/sign-up">Sign Up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
