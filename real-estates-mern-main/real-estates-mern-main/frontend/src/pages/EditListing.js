import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import SearchControl from "../components/GeoSearchControl.js";
import OpenStreetMapProvider from "../providers/openStreetMapProvider.js";
import { useDispatch, useSelector } from "react-redux";
import {
  editListing,
  getListing,
  removeListingImage,
  resetIsEdited,
  setDescription,
  setGeolocation,
  resetListing,
  resetImageRemoved,
} from "../features/listings/listingsSlice";
import { toast } from "react-toastify";
import { Alert } from "react-bootstrap";
import "../leaflet.geosearch.css";

const EditListing = () => {
  // eslint-disable-next-line
  const [lat, setLat] = useState("");
  // eslint-disable-next-line
  const [lng, setLng] = useState("");
  const [imagesInfo, setImagesInfo] = useState({
    urls: [],
    names: [],
    types: [],
  });
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const {
    listing,
    error,
    loading,
    imageRemoved,
    description,
    geolocation,
    isEdited,
    isMounted,
  } = useSelector((state) => state.listings);
  const { user } = useSelector((state) => state.users);
  const { listingId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    //eslint-disable-next-line
    formState: { errors, dirtyFields, isDirty },
    reset,
    getValues,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      type: "rent",
      building: "house",
      name: "",
      city: "",
      address: "",
      surface: 0,
      rooms: 1,
      floors: 1,
      bathrooms: 1,
      bedrooms: 1,
      parking: false,
      garage: true,
      furnished: true,
      offer: true,
      regularPrice: 0,
      images: {},
    },
  });
  //Geosearch leaflet
  const prov = OpenStreetMapProvider();
  const GeoSearchControlElement = SearchControl;

  useEffect(() => {
    dispatch(getListing(listingId));

    return () => dispatch(resetIsEdited());
  }, [listingId, dispatch, isEdited, imageRemoved]);

  useEffect(() => {
    if (isMounted) {
      if (listing !== null && user) {
        if (listing?.user._id !== user._id) {
          toast.error("To nije vaš oglas i ne možete ga uređivati");
          navigate("/");
          dispatch(resetListing());
        } else {
          const defaults = {
            type: listing?.type,
            building: listing?.building,
            name: listing?.name,
            city: listing?.city,
            address: listing?.address,
            surface: listing?.surface,
            rooms: listing?.rooms,
            floors: listing?.floors,
            bathrooms: listing?.bathrooms,
            bedrooms: listing?.bedrooms,
            parking: listing?.parking,
            garage: listing?.garage,
            furnished: listing?.furnished,
            offer: listing?.offer,
            regularPrice: listing?.regularPrice,
          };
          setLat(listing.geolocation.lat);
          setLng(listing.geolocation.lng);
          dispatch(setDescription(listing.description));
          dispatch(
            setGeolocation([listing.geolocation.lat, listing.geolocation.lng])
          );
          reset(defaults);
          // dispatch({ type: "SHOW_LEAFLET_MARKER" });
        }
      }
    }

    //eslint-disable-next-line
  }, [user, isMounted]);
  //maybe to remove textarea from dependencies??

  //gets values of our useForm
  const values = getValues();

  //updateImgUrls
  const updateImgUrls = async (img_id) => {
    dispatch(removeListingImage([listingId, img_id]));
  };

  // convert files to strings,so we can send it out as strings to backend and then upload
  const fileTo64String = (e) => {
    let files = e.target.files;
    const keys = Object.values(files);
    keys.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagesInfo((prev) => ({
          urls: [...prev.urls, reader.result],
          names: [...prev.names, file.name],
          types: [...prev.types, file.type],
        }));
      };
      return imagesInfo;
    });
  };

  const onSubmit = async (data) => {
    try {
      //check to see if selected number of images is greater than 6 - number of already uploaded images
      if (
        data.images.length > 6 - listing.images.length &&
        dirtyFields.images !== undefined
      ) {
        setError("images", {
          type: "max",
          message: `Nije moguće imati više od 6 slika`,
        });
      } else {
        const dataCopy = {
          ...data,
          description,
          geolocation,
        };
        delete dataCopy.images;
        dispatch(editListing([listingId, dataCopy, imagesInfo]));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert type="danger" variant="danger">
      {error}
    </Alert>
  ) : (
    isMounted && (
      <div className="createListingContainer">
        <header>
          <p className="pageHeader">Update Listing</p>
          <p className="go-back" onClick={() => navigate(-1)}>
            Go Back <i className="fas fa-undo"></i>
          </p>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Kategorija nekretnine */}
            <label>Sell/Rent</label>
            <div className="formButtonsDiv">
              <input type="text" {...register("type")} />
              <button
                type="button"
                onClick={(e) => setValue("type", "sell", { shouldDirty: true })}
                //kako bi rerenderovali formu,shouldDirty setujemo na true prilikom setovanja value-a. Rerenderovanje forme u ovom slučaju nam je važno zato što nam je klasa našeg button-a dinamična,zavisi od određene vrijednost iz objekta values
                className={`formButton ${
                  values.type !== "rent" ? "active" : ""
                }`}
              >
                Sell
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "rent", { shouldDirty: true })}
                className={`formButton ${
                  values.type === "rent" ? "active" : ""
                }`}
              >
                Rent
              </button>
            </div>
            {/* Kuća/Stan */}
            <label>House/Apartment</label>
            <div className="formButtonsDiv">
              <input type="text" {...register("building")} />
              <button
                type="button"
                onClick={() =>
                  setValue("building", "house", { shouldDirty: true })
                }
                className={`formButton ${
                  values.building === "house" ? "active" : ""
                }`}
              >
                House
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("building", "apartment", { shouldDirty: true })
                }
                className={`formButton ${
                  values.building !== "house" ? "active" : ""
                }`}
              >
                Apartment
              </button>
            </div>
            {/* Naziv nekretnine */}
            <label htmlFor="name">Name:</label>
            <input
              {...register("name", {
                required: "Polje je obavezno",
                minLength: {
                  value: 4,
                  message: "Polje mora sadržati više od 4 slova",
                },
              })}
              type="text"
              name="name"
            />
            <span style={{ color: "red" }}>{errors.name?.message}</span>
            {/* Grad */}
            <label htmlFor="city">City:</label>
            <input
              {...register("city", {
                required: "Polje je obavezno",
                minLength: {
                  value: 3,
                  message: "Polje mora sadržati više od 3 slova",
                },
              })}
              type="text"
              name="city"
            />
            <span style={{ color: "red" }}>{errors.city?.message}</span>
            {/* Adresa */}
            <label htmlFor="address">Address</label>
            <input
              {...register("address", {
                required: "Polje je obavezno",
                minLength: {
                  value: 6,
                  message: "Polje mora sadržati više od 6 slova",
                },
              })}
              type="text"
              name="address"
            />
            <span style={{ color: "red" }}>{errors.address?.message}</span>

            {/* Površina */}
            <label htmlFor="povrsina">Surface</label>
            <div className="surfaceCreateListing">
              <input
                {...register("surface", {
                  required: "Polje je obavezno",
                  min: {
                    value: 15,
                    message: "Površina ne može biti ispod 15m2",
                  },
                })}
                type="number"
                name="surface"
              />
              <span>m2</span>
            </div>
            <span style={{ color: "red" }}>{errors.surface?.message}</span>

            {/* Broj soba i spratova */}
            <div className="numberInputs">
              <div className="groupOfNumberInputs">
                <label htmlFor="rooms">Rooms</label>
                <input
                  {...register("rooms", {
                    required: "Polje je obavezno",
                    min: {
                      value: 1,
                      message: "Broj soba ne može biti 0",
                    },
                  })}
                  type="number"
                  name="rooms"
                />
              </div>
              <span style={{ color: "red" }}>{errors.rooms?.message}</span>
              {/* Ako je prodaja,prikaži opciju broj spratova */}
              {values.type === "sell" && (
                <div className="groupOfNumberInputs">
                  <label htmlFor="floors">Floors</label>
                  <input
                    {...register("floors", {
                      min: {
                        value: 1,
                        message: "Broj spratova ne može biti 0",
                      },
                    })}
                    type="number"
                    name="floors"
                  />
                </div>
              )}
            </div>
            <div className="numberInputs">
              <div className="groupOfNumberInputs">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  {...register("bathrooms")}
                  type="number"
                  name="bathrooms"
                />
              </div>
              <span style={{ color: "red" }}>{errors.bathroms?.message}</span>
              <div className="groupOfNumberInputs">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  {...register("bedrooms")}
                  type="number"
                  name="bedrooms"
                />
              </div>
              <span style={{ color: "red" }}>{errors.bedrooms?.message}</span>
            </div>

            {/* Parking */}
            <label htmlFor="parking">Parking</label>
            <div className="formButtonsDiv">
              <input {...register("parking")} type="text" />
              <button
                type="button"
                onClick={() => setValue("parking", true, { shouldDirty: true })}
                className={`formButton ${values.parking ? "active" : ""}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("parking", false, { shouldDirty: true })
                }
                className={`formButton ${!values.parking ? "active" : ""}`}
              >
                No
              </button>
            </div>
            {/* Garaža */}
            <label htmlFor="garaza">Garage</label>
            <div className="formButtonsDiv">
              <input {...register("garage")} type="text" />
              <button
                type="button"
                onClick={() => setValue("garage", true, { shouldDirty: true })}
                className={`formButton ${values.garage ? "active" : ""}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setValue("garage", false, { shouldDirty: true })}
                className={`formButton ${!values.garage ? "active" : ""}`}
              >
                No
              </button>
            </div>
            {/* Namješten */}
            <label htmlFor="furnished">Furnished</label>
            <div className="formButtonsDiv">
              <input {...register("furnished")} type="text" />
              <button
                type="button"
                onClick={() =>
                  setValue("furnished", true, { shouldDirty: true })
                }
                className={`formButton ${values.furnished ? "active" : ""}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("furnished", false, { shouldDirty: true })
                }
                className={`formButton ${!values.furnished ? "active" : ""}`}
              >
                No
              </button>
            </div>
            {/* Ponuda - sniženje*/}
            <label htmlFor="offer">Offer(discount)</label>
            <div className="formButtonsDiv">
              <input {...register("offer")} type="text" />
              <button
                type="button"
                onClick={() => setValue("offer", true, { shouldDirty: true })}
                className={`formButton ${values.offer ? "active" : ""}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setValue("offer", false, { shouldDirty: true })}
                className={`formButton ${!values.offer ? "active" : ""}`}
              >
                No
              </button>
            </div>
            {/* Regularna cijena */}
            <label htmlFor="regular">Regular price</label>
            <div className="createListingPriceDiv">
              <input
                name="regular"
                {...register("regularPrice", {
                  required: "Polje je obavezno",
                  min: {
                    value: 50,
                    message: "Vrijednost ne može biti ispod 50",
                  },
                })}
                type="number"
              />
              {values.type === "rent" ? (
                <span>KM / Monthly</span>
              ) : (
                <span>KM</span>
              )}
            </div>
            <span style={{ color: "red" }}>{errors.regularPrice?.message}</span>

            {/* Snižena cijena */}
            {values.offer && (
              <>
                <label htmlFor="discounted">Discounted price</label>
                <div className="createListingPriceDiv">
                  <input
                    name="discounted"
                    {...register("discountedPrice", {
                      required: "Polje je obavezno",
                      min: {
                        value: 50,
                        message: "Vrijednost ne može biti ispod 50",
                      },
                      max: {
                        value: values.regularPrice - values.regularPrice * 0.05,
                        message:
                          "Snižena mora biti manja bar za 5% od regularne!",
                      },
                    })}
                    type="number"
                  />
                  {values.type === "rent" ? (
                    <span>KM / Monthly</span>
                  ) : (
                    <span>KM</span>
                  )}
                </div>
                <span style={{ color: "red" }}>
                  {errors.discountedPrice?.message}
                </span>
              </>
            )}
            {/* Opis */}
            <label>Description</label>
            <textarea
              onChange={(e) => dispatch(setDescription(e.target.value))}
              value={description}
            />
            <span style={{ color: "red" }}>{errors.description?.message}</span>
            {/* Lokacija - geolokacija */}
            <label htmlFor="textarea">Location</label>
            <div className="leafletContainer-createListing" name="geolocation">
              <input type="number" step="any" name="latitude" />
              <input type="number" step="any" name="longitude" />
              <MapContainer
                style={{
                  height: "100%",
                  width: "100%",
                }}
                center={[
                  listing.geolocation.lat === null
                    ? ""
                    : listing.geolocation.lat,
                  listing.geolocation.lng === null
                    ? ""
                    : listing.geolocation.lng,
                ]}
                zoom={20}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoSearchControlElement
                  provider={prov}
                  showMarker={true}
                  showPopup={false}
                  popupFormat={({ query, result }) => {
                    dispatch(setGeolocation([result.raw.lat, result.raw.lon]));
                  }}
                  maxMarkers={1}
                  retainZoomLevel={false}
                  animateZoom={true}
                  autoClose={false}
                  searchLabel={"Enter address"}
                  keepResult={true}
                />
                <Marker
                  opacity={1}
                  position={[geolocation.lat, geolocation.lng]}
                ></Marker>
              </MapContainer>
              <span style={{ color: "red" }}>{errors.latitude?.message}</span>
            </div>
            {/* Added images */}
            <label
              htmlFor=""
              style={{ marginTop: "20px", marginBottom: "0px" }}
            >
              Choosen Images
            </label>
            <div className="uploaded-images">
              {listing?.images.length !== 0 &&
                listing?.images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="uploaded-image"
                    style={{ backgroundImage: `url(${imgSrc})` }}
                    onClick={() => updateImgUrls(listing.cloudinary_ids[idx])}
                  >
                    <i className="fas fa-times visible-edit-listing" />
                  </div>
                ))}
            </div>

            {/* Dodavanje slika  */}
            <>
              <label>Images (max. {`${6 - listing.images.length}`})</label>
              <input
                {...register("images")}
                type="file"
                accept=".jpg,.png,.jpeg"
                multiple
                onChange={fileTo64String}
              />
              <span style={{ color: "red" }}>{errors.images?.message}</span>
            </>

            <button type="submit" className="listing-btn">
              Update Listing
            </button>
          </form>
        </main>
      </div>
    )
  );
};

export default EditListing;
