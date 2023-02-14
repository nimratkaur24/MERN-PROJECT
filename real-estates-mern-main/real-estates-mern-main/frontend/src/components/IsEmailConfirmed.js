import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const IsEmailConfirmed = () => {
  const { user, loading } = useSelector((state) => state.users);

  if (loading) {
    return <Spinner />;
  }

  if (!loading) {
    return user && user?.isEmailConfirmed ? (
      <Outlet />
    ) : (
      <>
        {toast.info(
          "We've sent email to you. Plase confirm your email address!"
        )}
        <Navigate to="/" />
      </>
    );
  }
};

export default IsEmailConfirmed;
