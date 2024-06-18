import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex h-[100%]  flex-col items-center justify-center">
      <div className="md:w[20%] w-[60%] xl:w-[20%]">
        <img className="w-full" src="/app-logo-text.png" />
      </div>

      <div className="mt-5 w-full text-center">
        <span className="text-xl font-bold">
          Sign up to see
          <span className="text-pink-700"> photos </span>
          and
          <span className="text-pink-700"> videos </span>
          from your friends.
        </span>
      </div>

      <div className="mt-3">
        <span>
          <span className="cursor-pointer text-blue-400">
            <Link to="/login">Log in </Link>
          </span>
          or
          <span className="cursor-pointer text-blue-400">
            <Link to="/sign-up"> sign up </Link>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Home;
