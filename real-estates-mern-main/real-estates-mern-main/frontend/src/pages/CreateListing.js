import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchControl from "../components/GeoSearchControl.js";
import OpenStreetMapProvider from "../providers/openStreetMapProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  createListing,
  resetListing,
  setDescription,
  setGeolocation,
} from "../features/listings/listingsSlice";
import "../leaflet.geosearch.css";

const CreateListing = () => {
  const [imagesInfo, setImagesInfo] = useState({
    urls: [],
    names: [],
    types: [],
  });
  const dispatch = useDispatch();
  const { geolocation, description, loading, isCreated } = useSelector(
    (state) => state.listings
  );
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
      rooms: 1,
      floors: 1,
      bathrooms: 1,
      bedrooms: 1,
      type: "rent",
      building: "house",
      name: "",
      city: "",
      address: "",
      surface: 0,
      parking: false,
      garage: true,
      furnished: true,
      offer: true,
      regularPrice: 0,
      discountedPrice: 0,
      images: {},
    },
  });

  const navigate = useNavigate();
  //Geosearch leaflet
  const prov = OpenStreetMapProvider();
  const GeoSearchControlElement = SearchControl;

  const values = getValues();
  useEffect(() => {
    if (isCreated) {
      navigate("/profile");
      reset();
    }
    dispatch(resetListing());
  }, [isCreated, dispatch, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      if (data.images.length > 6) {
        setError("images", {
          type: "max",
          message: `Nije moguće imati više od 6 slika`,
        });
      } else {
        const dataCopy = {
          ...data,
          geolocation: geolocation,
          description: description,
        };
        dataCopy.images = [];

        if (dataCopy && imagesInfo.urls.length > 0) {
          setTimeout(() => {
            dispatch(createListing([dataCopy, imagesInfo]));
          }, 70);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="createListingContainer">
      <header>
        <p className="pageHeader">Create Listing</p>
        <p
          className="go-back"
          onClick={() => {
            navigate(-1);
          }}
        >
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
              //kako bi rerenderovali formu,shouldDirty setujemo na true prilikom setovanja value-a. Rerenderovanje forme u ovom slučaju nam je važno zato što nam je klasa našeg button-a dinamična,zavisi od određene vrijednost iz objekta values iz useForm hook-a
              className={`formButton ${values.type !== "rent" ? "active" : ""}`}
            >
              Sell
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "rent", { shouldDirty: true })}
              className={`formButton ${values.type === "rent" ? "active" : ""}`}
            >
              Rent
            </button>
          </div>
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
                  value: 10,
                  message: "Površina ne može biti ispod 10m2",
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
              <div>
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
                <span style={{ color: "red" }}>{errors.rooms?.message}</span>
              </div>
            </div>
            {/* Broj spratova */}
            <div className="groupOfNumberInputs">
              <div>
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
                <span style={{ color: "red" }}>{errors.floors?.message}</span>
              </div>
            </div>
          </div>
          <div className="numberInputs">
            <div className="groupOfNumberInputs">
              <div>
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  {...register("bathrooms", {
                    min: {
                      value: 0,
                      message: "Negativan broj nije dozvoljen",
                    },
                  })}
                  type="number"
                  name="bathrooms"
                />
              </div>
              <span style={{ color: "red" }}>{errors.bathrooms?.message}</span>
            </div>

            <div className="groupOfNumberInputs">
              <div>
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  {...register("bedrooms", {
                    min: {
                      value: 0,
                      message: "Negativan broj nije dozvoljen",
                    },
                  })}
                  type="number"
                  name="bedrooms"
                />
              </div>
              <span style={{ color: "red" }}>{errors.bedrooms?.message}</span>
            </div>
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
              onClick={() => setValue("parking", false, { shouldDirty: true })}
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
              onClick={() => setValue("furnished", true, { shouldDirty: true })}
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
            KM
          </div>
          <span style={{ color: "red" }}>{errors.regularPrice?.message}</span>
          {values.offer && (
            <>
              <label htmlFor="discounted"> Discounted price</label>
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
                KM
              </div>
              <span style={{ color: "red" }}>
                {errors.discountedPrice?.message}
              </span>
            </>
          )}
          {/* Opis */}
          <label htmlFor="textarea">Description</label>
          <textarea
            name="textarea"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            value={description}
          />
          <span style={{ color: "red" }}>{errors.description?.message}</span>
          {/* Lokacija */}
          <label htmlFor="textarea">Location</label>
          <div className="leafletContainer-createListing">
            <input type="number" step="any" name="latitude" />
            <input type="number" step="any" name="longitude" />
            <MapContainer
              style={{
                height: "100%",
                width: "100%",
              }}
              center={[44.5377105387028, 18.67441090963343]}
              zoom={10}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoSearchControlElement
                provider={prov}
                showMarker={true}
                showPopup={false}
                //popupFormat registruje naše submitanje upisane adrese. Nakon što submitujemo adresu,dobit ćemo objekat,iz tog objekta izvlačimo lat i lon upisane lokacije i to setujemo state-u geolocation.
                popupFormat={({ query, result }) => {
                  let lat = result.raw.lat;
                  let lng = result.raw.lon;
                  dispatch(setGeolocation([lat, lng]));
                  //   dispatch({ type: "SHOW_LEAFLET_MARKER" });
                }}
                maxMarkers={1}
                retainZoomLevel={false}
                animateZoom={true}
                autoClose={false}
                searchLabel={"Enter address"}
                keepResult={true}
              />
            </MapContainer>
            <span style={{ color: "red" }}>{errors.latitude?.message}</span>
          </div>
          {/* Dodavanje slika  */}
          <label>Images (max. 6)</label>
          <input
            {...register("images", {
              required: "Polje je obavezno",
            })}
            onChange={(e) => {
              setImagesInfo({ urls: [], names: [], types: [] });
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
                return;
              });
            }}
            type="file"
            accept=".jpg,.png,.jpeg"
            multiple
          />
          <span style={{ color: "red" }}>{errors.images?.message}</span>
          <button type="submit" className="listing-btn">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
