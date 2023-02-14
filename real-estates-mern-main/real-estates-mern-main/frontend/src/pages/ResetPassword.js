import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { resetIsPassword, resetPassword } from "../features/users/usersSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isPassword } = useSelector((state) => state.users);
  const [togglePassword, setTogglePassword] = useState(false);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });
  useEffect(() => {
    if (isPassword) {
      reset();
      navigate("/");
      dispatch(resetIsPassword());
    }
  }, [isPassword, navigate, dispatch, reset]);

  //toggle show password
  const toggleShowHidePassword = () => {
    setTogglePassword(!togglePassword);
  };

  const onSubmit = (data) => {
    console.log(data);
    dispatch(resetPassword([data, resetToken]));
  };
  return loading ? (
    <Spinner />
  ) : (
    <Container
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <Row className="justify-content-center text-center">
        <Col xs={12} sm={10} md={8} lg={7} xl={6}>
          <header className="d-flex align-items-center justify-content-center">
            <span
              style={{
                fontSize: "32px",
                fontWeight: "600",
                marginRight: "10px",
              }}
            >
              Reset Password
            </span>
            <i className="fas fa-key" style={{ fontSize: "26px" }}></i>
          </header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert type="danger" variant="danger">
                {error}
              </Alert>
            )}
            <Form.Group>
              <Form.Label style={{ textAlign: "left" }} htmlFor="password">
                New Password
              </Form.Label>
            </Form.Group>
            <div className="showHidePassword">
              <Form.Control
                {...register("password", {
                  required: "Field is required",
                  pattern: {
                    value:
                      // eslint-disable-next-line
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                    message:
                      "Password must contain at least 6 characters,uppercase and lowercase letter,special character and one number",
                  },
                })}
                type={togglePassword ? "text" : "password"}
              />
              <i
                className={togglePassword ? "fas fa-eye" : "fas fa-eye-slash"}
                onClick={toggleShowHidePassword}
              />
            </div>
            <span style={{ color: "red" }}>{errors.password?.message}</span>
            <Button type="submit" className="btn btn-primary mt-3">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
