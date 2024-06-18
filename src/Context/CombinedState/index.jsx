import UserState from "../auth/UserState";
import PropTypes from "prop-types";
import PostState from "../post/PostState";
import AdminState from "../Admin/AdminState";

const CombinedState = (props) => {
  return (
    <UserState>
      <AdminState>
        <PostState>{props.children}</PostState>
      </AdminState>
    </UserState>
  );
};

CombinedState.propTypes = {
  children: PropTypes.any,
};

export default CombinedState;
