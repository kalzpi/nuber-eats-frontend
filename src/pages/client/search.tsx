import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export const Search: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location.search);
  }, []);

  return <div>Search Page</div>;
};
