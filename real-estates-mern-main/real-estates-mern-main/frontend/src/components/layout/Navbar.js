import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../features/users/usersSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.users);

  // getting current user if token exist is ls. Value for token state comes from local storage.
  useEffect(() => {
    if (token !== "") {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  const matchPath = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="nav-footer">
      <ul className="navItems">
        <li
          className={matchPath("/") ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <i className="fas fa-compass"></i>
          <span className="text">Search</span>
        </li>
        <li
          className={matchPath("/ponude") ? "active" : "" ? "active" : ""}
          // onClick={() => navigate("/ponude")}
          onClick={() => toast.info("Offers page is still in progress")}
        >
          <i className="fas fa-tag"></i>
          <span className="text">Offers</span>
        </li>
        <li
          className={matchPath("/profile") ? "active" : "" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          <i className="fas fa-user"></i>
          <span className="text">Profile</span>
        </li>
      </ul>
    </footer>
  );
};

export default Navbar;
