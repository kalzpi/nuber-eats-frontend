import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import nuberLogo from '../images/logo.svg';

export const Header: React.FC = () => {
  const { data } = useMe();
  console.log(data);
  return (
    <Fragment>
      {!data?.me.isVerified && (
        <div className='bg-red-400 p-3 text-center text-sm text-white'>
          Please verify your email.
        </div>
      )}
      <header className='py-4'>
        <div className='w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center'>
          <Link to='/'>
            <img src={nuberLogo} alt='' className='w-24' />
          </Link>
          <span className='text-sm'>
            <Link to='/edit-profile'>
              <FontAwesomeIcon icon={faUser} className='text-xl' />
              {data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </Fragment>
  );
};
