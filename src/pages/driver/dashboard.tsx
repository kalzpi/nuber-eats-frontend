import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

interface ICoords {
  lat: number;
  lng: number;
}

const Driver: React.FC<IDriverProps> = () => (
  <div className='h-8 w-8 flex justify-center items-center text-lg'>🛵</div>
);

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 37.334337,
    lng: 126.809901,
  });

  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (results, status) => {
      //       console.log(status, results);
      //     }
      //   );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setMap(map);
    setMaps(maps);
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  const onGetRouteClick = () => {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    if (map) directionsRenderer.setMap(map);
    directionsService.route(
      {
        origin: {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        destination: {
          location: new google.maps.LatLng(
            driverCoords.lat + 0.05,
            driverCoords.lng + 0.05
          ),
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        directionsRenderer.setDirections(result);
      }
    );
  };

  return (
    <div>
      <div
        className='overflow-hidden'
        style={{ width: window.innerWidth, height: '50vh' }}
      >
        <GoogleMapReact
          defaultZoom={16}
          defaultCenter={{ lat: 37.334337, lng: 126.809901 }}
          bootstrapURLKeys={{ key: 'AIzaSyA1naraLDW4prKLNmduEA0zPbVrcPQLyQw' }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick} className=''>
        Get Route
      </button>
    </div>
  );
};
