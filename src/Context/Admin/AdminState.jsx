import AdminContext from "./AdminContext";
import PropsTypes from "prop-types";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const AdminState = (props) => {
  const host = import.meta.env.VITE_HOST;

  const reportPost = async ({ postID, reason }) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        postid: postID,
        reason: reason,
      };

      const data = await fetch(`${host}/api/admin/report-post`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        toast.success(response.msg);
        return response;
      }
      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };
  const reportUser = async ({ userName, reason }) => {
    try {
      let user = JSON.parse(Cookies.get("token"));
      const headersList = {
        token: user.token,
        userName: userName,
        reason: reason,
      };

      const data = await fetch(`${host}/api/admin/report-user`, {
        credentials: "include",
        headers: headersList,
        method: "POST",
      });

      let response = await data.json();
      console.log(response);

      if (response.status) {
        toast.success(response.msg);
        return response;
      }
      if (!response.status) {
        toast.warn(response.msg);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  return (
    <AdminContext.Provider value={{ reportPost, reportUser }}>
      {props.children}
    </AdminContext.Provider>
  );
};

AdminState.propTypes = {
  children: PropsTypes.any,
};

export default AdminState;
