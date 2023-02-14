import { useEffect } from "react";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Ponude = () => {
  useEffect(() => {}, []);

  /* TO DO  */

  // return offerTrueListings !== null ? (
  //   <div className="offerPageContainer">
  //     <header style={{ justifyContent: "center" }}>
  //       <div className="pageHeader">Izdvojene nekretnine</div>
  //     </header>
  //     <main>
  //       <div className="offerTrueListings">
  //         {offerTrueListings.map((listing) => (
  //           <ListingItem key={listing.id} id={listing.id} data={listing.data} />
  //         ))}
  //       </div>
  //     </main>
  //   </div>
  // ) : (
  //   <span
  //     style={{
  //       position: "absolute",
  //       left: "50%",
  //       top: "50%",
  //       transform: "translate(-50%,-50%)",
  //       fontSize: "46px",
  //     }}
  //   >
  //     Nema izdvojenih oglasa
  //   </span>
  // );
};

export default Ponude;
