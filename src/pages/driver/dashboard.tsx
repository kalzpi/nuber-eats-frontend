import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { coockedOrders } from '../../__generated/coockedOrders';
import { useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated/takeOrder';

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      error
      ok
    }
  }
`;

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

  const makeRoute = () => {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: '#000' },
    });
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
      (result) => {
        directionsRenderer.setDirections(result);
      }
    );
  };

  const { data: cookedOrdersData } = useSubscription<coockedOrders>(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    { onCompleted }
  );
  const triggetMutation = (orderId: number) => {
    takeOrderMutation({
      variables: { input: { id: orderId } },
    });
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

      {cookedOrdersData?.cookedOrders && (
        <div className='max-w-screen-sm mx-auto  bg-white relative -top-10 shadow-lg py-8 px-5'>
          <h1 className='text-center text-2xl font-semibold'>
            New Coocked Order
          </h1>
          <h4 className='text-center text-xl my-3'>
            Pick it up soon! @ {cookedOrdersData.cookedOrders.restaurant?.name}
          </h4>
          <button
            onClick={() => triggetMutation(cookedOrdersData.cookedOrders.id)}
            className='btn w-full mt-5 block text-center'
          >
            Accept Challenge &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
