import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import cities from "../assets/cities/gradovi.json";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  setCity,
  setPriceFrom,
  setPriceTo,
  setSearchKeyword,
  setSurfaceFrom,
  setSurfaceTo,
} from "../features/listings/listingsSlice";

const FilterComponent = ({ active }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    dispatch(setSearchKeyword(data.keywords));
    dispatch(setCity(data.city));
    dispatch(setPriceFrom(data.minPrice));
    dispatch(setPriceTo(data.maxPrice));
    dispatch(setSurfaceFrom(data.minSurface));
    dispatch(setSurfaceTo(data.maxSurface));
  };

  return (
    <div className={`category-page ${active ? "active" : ""}`}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <button
          type="submit"
          style={{
            backgroundColor: "transparent",
            textAlign: "right",
            border: "none",
            fontSize: "20px",
            width: "100%",
            // display: `${changeDidHappen ? "block" : "none"}`,
          }}
        >
          <i className="fas fa-sync" />
        </button>
        <Row>
          <Col>
            <Form.Label htmlFor="keywords">
              <i className="fas fa-key" /> Search
            </Form.Label>
            <Form.Control
              name="keywords"
              {...register("keywords")}
              type="text"
              placeholder="Stan..."
            />
            <span style={{ color: "red" }}>{errors.keywords?.message}</span>
          </Col>
          <Col>
            <Form.Label htmlFor="city">
              <i className="fas fa-building" />
              City
            </Form.Label>
            <Form.Select
              name="city"
              {...register("city", {
                minLength: {
                  value: 3,
                  message: "Must contain at least 3 characters",
                },
              })}
              type="text"
              placeholder="Tuzla..."
            >
              <option></option>
              {cities.map((city, idx) => {
                return (
                  <option key={idx} value={city.name}>
                    {city.name}
                  </option>
                );
              })}
            </Form.Select>
            <span style={{ color: "red" }}>{errors.city?.message}</span>
          </Col>
        </Row>

        <Row className="mt-2">
          <Form.Label htmlFor="price">
            <i className="fas fa-euro-sign" /> Price
          </Form.Label>
          <Col>
            <Form.Control
              name="minPrice"
              {...register("minPrice", {
                min: {
                  value: 0,
                  message: "Cijena ne može biti negativna",
                },
              })}
              type="number"
              placeholder="From"

              // style={{ textAlign: "left" }}
            />
          </Col>
          <Col>
            <Form.Control
              name="maxPrice"
              {...register("maxPrice", {
                min: {
                  value: 0,
                  message: "Cijena ne može biti negativna",
                },
              })}
              type="number"
              placeholder="To"

              // style={{ textAlign: "left" }}
            />
          </Col>
          <span style={{ color: "red" }}>
            {/* {errors.startingPrice?.message || errors.endingPrice?.message} */}
          </span>
        </Row>

        <Row className="mt-2">
          <Form.Label htmlFor="surface">
            <i className="fas fa-vector-square" />
            Surface
          </Form.Label>
          <Col>
            <Form.Control
              name="minSurface"
              {...register("minSurface", {
                min: {
                  value: 0,
                  message: "Površina ne može biti negativna",
                },
              })}
              type="number"
              placeholder="From"
            />
          </Col>
          <Col>
            <Form.Control
              name="maxSurface"
              {...register("maxSurface", {
                min: {
                  value: 0,
                  message: "Površina ne može biti negativna",
                },
              })}
              type="number"
              placeholder="To"
            />
          </Col>
          <span style={{ color: "red" }}>
            {errors.minSurface?.message || errors.maxSurface?.message}
          </span>
        </Row>
      </Form>
    </div>
  );
};

export default FilterComponent;
