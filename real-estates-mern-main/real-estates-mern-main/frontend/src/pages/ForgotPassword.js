import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  resetEmailSentState,
} from "../features/users/usersSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { error, loading, isEmailSent } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isEmailSent) {
      reset();
      dispatch(resetEmailSentState());
      navigate("/");
    }
  }, [isEmailSent, navigate, dispatch, reset]);

  // fix loading error
  const onSubmit = (data) => {
    dispatch(forgotPassword(data));
  };

  if (loading) {
    return <Spinner />;
  }

  return loading ? (
    <Spinner />
  ) : (
    <Container
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <Row className="justify-content-center text-center">
        <Col xs={12} sm={10} md={8} lg={7} xl={6}>
          <i
            className="fas fa-paper-plane"
            style={{ fontSize: "28px", color: "#007bff", fontWeight: "600" }}
          ></i>
          <p>
            Enter the Email Addresss associated with your account and we'll send
            you a link to reset your password
          </p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert type="danger" variant="danger">
                {error}
              </Alert>
            )}
            <Form.Control
              {...register("email", {
                required: "Field is required",
                pattern: {
                  // eslint-disable-next-line
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email",
                },
              })}
              type="email"
            />
            <span
              style={{
                color: "red",
                width: "100%",
                textAlign: "left",
                display: "block",
                marginTop: "10px",
              }}
            >
              {errors.email?.message}
            </span>
            <Button type="submit" className="btn btn-primary mt-3">
              Send Password Reset Email
            </Button>
          </Form>
          <footer className="footerForgotPassword">
            <p>
              Don't have an account?<Link to="/sign-up"> Sign Up</Link>
            </p>
            <p>
              Go to <Link to="/sign-in">Sign In</Link> page
            </p>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
