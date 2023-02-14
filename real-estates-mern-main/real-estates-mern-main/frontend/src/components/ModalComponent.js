import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteListing,
  setShowModal,
} from "../features/listings/listingsSlice";
import Spinner from "./Spinner";

const ModalComponent = () => {
  const dispatch = useDispatch();
  const { loading, showModal, listingID } = useSelector(
    (state) => state.listings
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <Modal show={showModal}>
      <Modal.Header className="d-flex justify-content-between">
        <span style={{ fontSize: "20px", fontWeight: "700" }}>Warning!</span>
      </Modal.Header>
      <Modal.Body>
        <span>Are you sure you want to delete listing?</span>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => dispatch(deleteListing(listingID))}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          data-dismiss="modal"
          onClick={() => dispatch(setShowModal([false, null]))}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
