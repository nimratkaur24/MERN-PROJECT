import saleImg from "../assets/jpg/saleImg.jpg";
import rentImg from "../assets/jpg/rentImg.jpg";
import { Container, Row, Image, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getListings } from "../features/listings/listingsSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";

const LandingPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, listings } = useSelector((state) => state.listings);

  useEffect(() => {
    const url_data = ["", "", "", "", "", "", "", 1, 5, "-createdAt"];

    dispatch(getListings(url_data));
  }, [dispatch]);

  return loading ? (
    <Spinner />
  ) : (
    <Container className="mt-5 " fluid="md" style={{ paddingBottom: "100px" }}>
      <header>
        <p className="pageHeader">Find Ideal Place For You</p>
      </header>
      <main style={{ overflow: "scroll" }}>
        <p className="landing-page-paragraf">Suggested</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={2}
          pagination={{ clickable: true }}
          style={{
            width: "100%",
          }}
        >
          {listings?.map((listing, idx) => (
            <SwiperSlide
              key={idx}
              onClick={() => navigate(`/listings/${listing._id}`)}
            >
              <div
                className="swiperSlideDiv-landingPage"
                style={{
                  backgroundImage: `url(${listing.images[0]})`,
                }}
              >
                <p className="swiperSlideText">{listing.name}</p>
                <p className="swiperSlidePrice">
                  {listing?.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {`${listing.type === "rent" ? "KM / Monthly" : "KM"}`}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="landing-page-paragraf" style={{ marginTop: "50px" }}>
          Category
        </p>
        <Container>
          <Row className="ctg-row">
            <Col onClick={() => navigate("/category/sell")}>
              <Image fluid rounded src={saleImg} alt="sale" />
              {/* <p className="category-title">Nekretnine za prodaju</p> */}
            </Col>
            <Col onClick={() => navigate("/category/rent")}>
              <Image fluid rounded src={rentImg} alt="rent" />
              {/* <p className="category-title">Nekretnine za najam</p> */}
            </Col>
          </Row>
        </Container>
      </main>
    </Container>
  );
};

export default LandingPage;
