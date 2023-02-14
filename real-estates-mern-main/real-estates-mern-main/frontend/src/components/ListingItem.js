import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./ModalComponent";
import { setShowModal } from "../features/listings/listingsSlice.js";

const ListingItem = ({ id, data, onDelete, edit }) => {
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.listings);
  const {
    bathrooms,
    bedrooms,
    discountedPrice,
    images,
    regularPrice,
    surface,
    address,
  } = data;

  const navigate = useNavigate();

  const handleClick = async (e) => {
    // delete document;
    if (
      e.target.classList.contains("fa-trash") ||
      e.target.classList.contains("deleteListing")
    ) {
      const data = [true, id];
      dispatch(setShowModal(data));
    } else if (
      //edit document
      e.target.classList.contains("fa-edit") ||
      e.target.classList.contains("editListing")
    ) {
      navigate(`/edit-listing/${id}`);
    } else {
      navigate(`/listings/${id}`);
    }
  };

  return (
    data !== undefined && (
      <>
        <div className="listingItem" onClick={handleClick} id="listing-item">
          <p className="listingPrice">
            {regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {"KM"}
            {/* {data?.type === "rent" ? "mjesečno" : ""} */}
          </p>
          <div
            className="listingItemImg"
            style={{
              backgroundImage: `url(${images[0]})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <ul className="listingMoreInfo">
            <li className="icons">
              <i className="fas fa-map-marker-alt" />
              {address}
            </li>
            <li>
              <i className="fas fa-object-group" />
              {surface} m2
            </li>
            {discountedPrice !== 0 && (
              <li className="icons">
                <i className="fas fa-tag" />
                Discounted Price :{" "}
                {/* {data?.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                {`KM`} */}
              </li>
            )}
            <li className="iconsForResponsive">
              <i className="fas fa-bed" />
              {bedrooms}
            </li>
            <li className="iconsForResponsive">
              <i className="fas fa-bath" />
              {bathrooms}
            </li>
          </ul>
          {onDelete && (
            <button className="deleteListing">
              <i className="fas fa-trash"></i>
            </button>
          )}
          {edit && (
            <button className="editListing">
              <i className="fas fa-edit"></i>
            </button>
          )}
        </div>

        {showModal && <ModalComponent />}
      </>
    )
  );
};

ListingItem.defaultProps = {
  index: "",
};

export default ListingItem;
