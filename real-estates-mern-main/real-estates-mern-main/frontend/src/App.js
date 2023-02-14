import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import {
  LandingPageP,
  ProfileP,
  SignInP,
  SignUpP,
  CategoryP,
  SingleListingP,
  CreateListingP,
  EditListingP,
  VerifyEmailP,
  ForgotPasswordP,
  ResetPasswordP,
  ErrorP,
} from "./pages/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import IsEmailConfirmed from "./components/IsEmailConfirmed";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPageP />} />
          <Route exact path="/sign-in" element={<SignInP />} />
          <Route exact path="/sign-up" element={<SignUpP />} />
          <Route exact path="/category/:categoryType" element={<CategoryP />} />
          <Route
            exact
            path="/listings/:listingId"
            element={<SingleListingP />}
          />
          <Route exact path="/confirmEmail" element={<VerifyEmailP />} />
          <Route exact path="/forgotPassword" element={<ForgotPasswordP />} />
          <Route exact path="/resetPassword" element={<ResetPasswordP />} />

          <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
            <Route element={<IsEmailConfirmed />}>
              <Route exact path="/profile" element={<ProfileP />} />
              <Route
                exact
                path="/create-listing"
                element={<CreateListingP />}
              />
              <Route
                exact
                path="/edit-listing/:listingId"
                element={<EditListingP />}
              />
            </Route>
            <Route exact path="*" element={<ErrorP />} />
          </Route>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer
        autoClose={4000}
        draggable={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </>
  );
}

export default App;
