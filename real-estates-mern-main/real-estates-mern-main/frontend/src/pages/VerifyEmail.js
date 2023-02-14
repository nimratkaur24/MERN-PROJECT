import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { confirmEmail } from "../features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token !== null) {
      dispatch(confirmEmail(token));
    }
  }, [token, dispatch]);

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert type="danger" variant="danger">
      {error}
    </Alert>
  ) : (
    <Modal
      show={!loading}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="d-flex justify-content-between" closeButton>
        <span style={{ fontSize: "20px", fontWeight: "700" }}>
          Your Email Is Verified. Please,go back to home page and reload it.
        </span>
      </Modal.Header>
      <Modal.Body>
        <span>You can now sign in with you account. Have fun!</span>
      </Modal.Body>
      <Modal.Footer>
        <Button>
          <Link to="/" style={{ color: "#eee", textDecoration: "none" }}>
            Go Back
          </Link>
        </Button>
      </Modal.Footer>
    </Modal>
  );
  //TO DO - CREATE 404 NOT FOUND PAGE
};

export default VerifyEmail;
