import { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../Context/auth/userContext";

const Page404 = () => {
  const { isLoggedIn } = useContext(userContext);
  return (
    <div className="flex w-full flex-col">
      {!isLoggedIn && (
        <div className="absolute top-0  flex w-full flex-row items-center justify-between border-b border-gray-300 py-3 xl:flex">
          <div className="w-[20%] md:w-[10%] xl:w-[10%] ">
            <Link to="/" className="cursor-pointer">
              <img className="w-full" src="/app-logo-text.png" />
            </Link>
          </div>

          <div>
            <button className="mx-2 cursor-pointer rounded bg-blue-700 p-2 font-medium text-white">
              <Link to="/login"> Log in </Link>
            </button>
            <button className="mx-2 cursor-pointer rounded bg-blue-700 p-2 font-medium text-white">
              <Link to="/sign-up">Sign up </Link>
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 flex w-full flex-col items-center justify-center pt-10 text-center">
        <span className="my-3 text-2xl font-medium">
          Sorry, this page isn&apos;t available.
        </span>

        <span>
          The link you followed may be broken, or the page may have been
          removed.
          <span className="cursor-pointer font-light text-[#00376B]">
            <Link to="/"> Go back to Real Talk.</Link>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Page404;
