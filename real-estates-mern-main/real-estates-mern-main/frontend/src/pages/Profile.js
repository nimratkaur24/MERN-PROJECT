import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { Alert, Col, Row } from "react-bootstrap";
import { logout, updateUser, upload } from "../features/users/usersSlice";
import { getUserListings } from "../features/listings/listingsSlice";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const [isImagePosted, setIsImagePosted] = useState(false);
  const [allowProfileChanges, setAllowProfileChanges] = useState(false);
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userListings,
    error: listingsError,
    isDeleted,
  } = useSelector((state) => state.listings);
  const { user, loading, error } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      imageURL: "",
    },
  });

  useEffect(() => {
    if (user) {
      dispatch(getUserListings());
      const defaults = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        imageURL: user?.avatar === undefined ? "" : user.avatar,
      };
      reset(defaults);
    }
  }, [user, isDeleted, dispatch, reset]);

  const onSubmit = async (data) => {
    dispatch(updateUser(data));
  };

  // on change what happens
  const handleFileInputChange = (e) => {
    setIsImagePosted(true);
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  // preview image
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // cancle confirmation
  const cancelProfilePhoto = () => {
    setPreviewSource("");
    setIsImagePosted(false);
  };

  // confifrm profile photo
  const confirmProfilePhoto = () => {
    if (!previewSource) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => {
      dispatch(upload(reader.result));
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
    setIsImagePosted(false);
  };

  return loading ? (
    <Spinner />
  ) : error || listingsError ? (
    <Alert type="info" variant="info">
      {error || listingsError}
    </Alert>
  ) : (
    <div className="profileContainer">
      <Row className="d-flex align-items-center mb-3">
        <Col>
          <h2>My profile</h2>
        </Col>
        <Col className="d-flex justify-content-end">
          <p
            className="logout"
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout <i className="fas fa-sign-out-alt"></i>
          </p>
        </Col>
      </Row>
      <main>
        <div className="profileInfo">
          <div
            className="profilePhotoDiv"
            style={{
              backgroundImage:
                user?.avatar === undefined ? "" : `url(${user.avatar})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {previewSource !== "" && <img src={previewSource} alt="" />}
            <div className="addPhoto">
              <input
                {...register("imageURL", {
                  onChange: handleFileInputChange,
                })}
                type="file"
                // value={fileInputState !== "" ? fileInputState : user?.avatar}
                accept=".jpg,.png,.jpeg"
                disabled={isImagePosted ? true : false}
              />
              <i
                className={
                  isImagePosted ? "fas fa-camera hidden" : "fas fa-camera"
                }
              />
              <div className="saveOrCancel">
                <i
                  className={
                    isImagePosted ? "fas fa-check visible" : "fas fa-check"
                  }
                  onClick={confirmProfilePhoto}
                />
                <i
                  className={
                    isImagePosted ? "fas fa-times visible" : "fas fa-times"
                  }
                  onClick={cancelProfilePhoto}
                ></i>
              </div>
            </div>
          </div>
          <div className="profileHeader">
            <p>Personal Details</p>
            <button
              className="change"
              onClick={() => setAllowProfileChanges(!allowProfileChanges)}
            >
              {allowProfileChanges ? "Done" : "Change"}
            </button>
          </div>
          <form className="profileForm" onSubmit={handleSubmit(onSubmit)}>
            <input
              name="name"
              {...register("name", {
                required: "Field is required",
                minLength: {
                  value: 3,
                  message: "Username must contain at least 3 characters",
                },
                maxLength: {
                  value: 18,
                  message: "Username must contain less than 18 characters",
                },
              })}
              type="text"
              className={allowProfileChanges ? "allowChange" : ""}
              disabled={allowProfileChanges ? false : true}
            />
            <small style={{ color: "red", fontSize: "10px" }}>
              {errors.name?.message}
            </small>

            <input
              name="phone"
              {...register("phone", {
                required: "Field is required",
                pattern: {
                  value:
                    /^[+][0-9]{3}[\s-.]?[6][1-5][\s-.]?[0-9]{3}[\s-.]?[0-9]{3,4}$/,
                  message:
                    "Examples: 1) +38761653789 2) +386 62 653 789 3) +384.64.653.7891 4) +387-63-653-789",
                },
              })}
              type="tel"
              className={allowProfileChanges ? "allowChange" : ""}
              disabled={allowProfileChanges ? false : true}
              //disabled ako je allowChange false,u suprotnom nije disabled
            />
            <small style={{ color: "red", fontSize: "10px" }}>
              {errors.phone?.message}
            </small>

            <div style={{ display: "flex" }}>
              <button
                type="submit"
                style={{ marginRight: "15px" }}
                className={`btn btn-sm btn-secondary ${
                  allowProfileChanges ? "visible" : "invisible"
                }`}
                //ako je allowChange true,bit će vidljiv button,u suprotnom neće biti vidljiv
              >
                Confirm Changes
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-secondary ${
                  allowProfileChanges ? "visible" : "invisible"
                }`}
                onClick={() => {
                  setAllowProfileChanges(false);
                  reset();

                  //ako abortujemo promjenu,resetujemo na defaultne vrijednosti
                }}
              >
                Abort changes
              </button>
            </div>
          </form>
          <Link to="/create-listing" className="createListingLink">
            <i className="fas fa-home" />
            <span>Sell or rent your real estate</span>
            <i className="fas fa-arrow-right" />
          </Link>
        </div>
        <p className="yourListings">Your listings</p>
      </main>
      <div className="yourListingsContainer">
        {userListings?.length > 0 &&
          userListings !== undefined &&
          userListings?.map((listing, idx) => (
            <ListingItem
              key={idx}
              id={listing._id}
              data={listing}
              onDelete={true}
              edit={true}
              index={idx}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
