import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/users/usersSlice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [policies, setPolicies] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
    number: false,
  });

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    if (user) {
      if (!loading) {
        return navigate(from, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [user, from, navigate]);

  const checkPasswordPolicies = (e) => {
    const password = e.target.value;

    if (password.length > 0) {
      // uppercase
      if (/[A-Z]/.test(password)) {
        setPolicies((prev) => {
          return { ...prev, uppercase: true };
        });
      } else {
        setPolicies((prev) => {
          return { ...prev, uppercase: false };
        });
      }

      // lowercase
      if (/[a-z]/.test(password)) {
        setPolicies((prev) => {
          return { ...prev, lowercase: true };
        });
      } else {
        setPolicies((prev) => {
          return { ...prev, lowercase: false };
        });
      }

      // number
      if (/[0-9]/.test(password)) {
        setPolicies((prev) => {
          return { ...prev, number: true };
        });
      } else {
        setPolicies((prev) => {
          return { ...prev, number: false };
        });
      }

      // special chars
      // eslint-disable-next-line
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        setPolicies((prev) => {
          return { ...prev, special: true };
        });
      } else {
        setPolicies((prev) => {
          return { ...prev, special: false };
        });
      }

      // length
      if (password.length >= 6) {
        setPolicies((prev) => {
          return { ...prev, length: true };
        });
      } else {
        setPolicies((prev) => {
          return { ...prev, length: false };
        });
      }
    } else {
      setPolicies({});
    }
  };

  //what happens after submit
  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return loading ? (
    <Spinner />
  ) : (
    <Container fluid="md" className="mt-5 sign-form">
      <Row className="align-items-center text-center">
        <Col xs="12" sm="12">
          <p className="pageHeader">Welcome Back</p>
        </Col>
        <Col>
          <p>
            Already a member?
            <Link to="/sign-in" className="link">
              Sign In Instead
            </Link>
          </p>
        </Col>
      </Row>
      <main>
        <Container>
          <Row className="justify-content-center">
            {error && (
              <Alert type="danger" variant="danger">
                {error}
              </Alert>
            )}
            <Col xs={12} sm={10} md={8} lg={7} xl={5}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="name"
                    {...register("name", {
                      required: "Field is required",
                      minLength: {
                        value: 3,
                        message: "Username must contain at least 3 characters",
                      },
                      maxLength: {
                        value: 18,
                        message:
                          "Username must contain less than 18 characters",
                      },
                    })}
                    type="text"
                  />
                </Form.Group>
                <span style={{ color: "red" }}>{errors.name?.message}</span>

                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    name="phone"
                    {...register("phone", {
                      required: "Field is required",
                      pattern: {
                        value:
                          /^[+][0-9]{3}[\s-.]?[6][1-5][\s-.]?[0-9]{3}[\s-.]?[0-9]{3,4}$/,
                        message:
                          "Please enter a valid number format. Example: +38761322513",
                      },
                    })}
                    type="tel"
                    id="phone"
                    // disabled
                  />
                </Form.Group>
                <span style={{ color: "red" }}>{errors.phone?.message}</span>

                <Form.Group>
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    name="email"
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
                </Form.Group>
                <span style={{ color: "red" }}>{errors.email?.message}</span>

                <Form.Group className="frm-el">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    name="password"
                    {...register("password", {
                      required: "Field is required",
                      pattern: {
                        value:
                          // eslint-disable-next-line
                          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                        message:
                          "Password must contain at least 6 characters,uppercase and lowercase letter,special character and one number",
                      },
                      onChange: (e) => checkPasswordPolicies(e),
                    })}
                    onFocus={() => setShowPolicies(true)}
                    onBlur={() => setShowPolicies(false)}
                    type={showPassword ? "text" : "password"}
                  />
                  <div
                    className="togglePassword"
                    onClick={() => togglePassword()}
                  >
                    <i
                      className={
                        showPassword ? "fas fa-eye" : "fas fa-eye-slash"
                      }
                      onClick={() => togglePassword()}
                    />
                  </div>
                </Form.Group>
                <div
                  className={`password-policies ${
                    showPolicies ? "active" : ""
                  }`}
                >
                  <div
                    className={`policy-length ${
                      policies.length ? "active" : ""
                    }`}
                  >
                    6 Characters
                  </div>
                  <div
                    className={`policy-number ${
                      policies.number ? "active" : ""
                    }`}
                  >
                    Contains Number
                  </div>
                  <div
                    className={`policy-uppercase ${
                      policies.uppercase ? "active" : ""
                    }`}
                  >
                    Contains Uppercase
                  </div>
                  <div
                    className={`policy-lowercase ${
                      policies.lowercase ? "active" : ""
                    }`}
                  >
                    Contains Lowercase
                  </div>
                  <div
                    className={`policy-special ${
                      policies.special ? "active" : ""
                    }`}
                  >
                    Contains Special Character
                  </div>
                </div>
                <span style={{ color: "red" }}>{errors.password?.message}</span>
                <Link to="/forgotPassword" className="forgotPassword">
                  Forgot Password
                </Link>
                <Row style={{ padding: "0px 30%" }}>
                  <Button type="submit" className="btn  btn-primary">
                    Sign Up
                  </Button>
                </Row>

                {/* <GoogleSignIn /> */}
              </Form>
            </Col>
          </Row>
        </Container>
      </main>
    </Container>
  );
};
export default SignUp;
