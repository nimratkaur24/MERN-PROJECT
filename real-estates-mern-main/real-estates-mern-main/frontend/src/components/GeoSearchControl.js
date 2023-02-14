import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import { useDispatch } from "react-redux";
import { setGeolocation } from "../features/listings/listingsSlice";

const SearchControl = (props) => {
  const dispatch = useDispatch();
  const map = useMap();
  const markerOptions = {
    draggable: true,
  };
  const searchControl = new GeoSearchControl({
    provider: props.provider,
    marker: markerOptions,
    notFoundMessage: "Sorry, that address could not be found.",
    ...props,
  });

  useEffect(() => {
    map.addControl(searchControl);
    map.on("geosearch/marker/dragend", (e) => {
      const { location } = e;
      let lat = location.lat;
      let lng = location.lng;
      dispatch(setGeolocation([lat, lng]));
      //kada se povlačenje markera na mapi završi,uzimamo lat i lng tamo gdje je postavljen marker i te vrijednosti setujemo state geolocation.
    });
    map.on("geosearch/showlocation", (e) => {
      //event koji se trigeruje kada se prikaže lokacija na leaflet mapi
      const { location } = e;
      let lat = location.lat;
      let lng = location.lng;
      // dispatch(setGeolocation([lat, lng]));
    });

    return () => map.removeControl(searchControl);
    //eslint-disable-next-line
  }, []);
  //IF SOMETHING GOES WRONG,ADD DEPENDENCIES
  return null;
};

export default SearchControl;
