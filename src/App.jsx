import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/logs/Login";
import SignUp from "./pages/logs/SignUp";
import Dashboard from "./pages/User/Dashboard";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import { useContext } from "react";
import userContext from "./Context/auth/userContext";
import Test from "./TEST/Test";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const { isLoggedIn } = useContext(userContext);

  return (
    <>
      <ToastContainer />
      {/* <Link to='/test' className="absolute top-10 left-10 z-[99999]" >TEST</Link> */}
      <Routes>
        <Route path="/test" element={<Test />} />
        {isLoggedIn ? (
          <>
            <Route path="*" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/*" element={<Page404 />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
