import { useEffect, useState } from "react";

function useGeolocation() {
  const [geoPosition, setGeoPosition] = useState<GeolocationPosition>();
  var geoWatch: any;
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        setCurrentPosition,
        positionError,
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }

    startWatch();
    return () => stopWatch();
  }, []);

  function setCurrentPosition(position: any) {
    console.log(position);
    setGeoPosition(position);
  }

  function startWatch() {
    if (!geoWatch) {
      if (
        "geolocation" in navigator &&
        "watchPosition" in navigator.geolocation
      ) {
        geoWatch = navigator.geolocation.watchPosition(
          setCurrentPosition,
          positionError,
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      }
    }
  }

  function stopWatch() {
    navigator.geolocation.clearWatch(geoWatch);
    geoWatch = undefined;
  }

  function positionError(error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;

      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;

      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;

      case error.UNKNOWN_ERROR:
        console.error("An unknown error occurred.");
        break;
    }
  }

  return [geoPosition];
}

export default useGeolocation;
