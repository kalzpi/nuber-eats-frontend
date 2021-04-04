import { render } from '@testing-library/react';
import React from 'react';
import { Restaurant } from '../restaurant';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Restaurant />', () => {
  it('renders OK with props', () => {
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant
          id='1'
          coverImage='x'
          name='nameTest'
          categoryName='catTest'
        />
      </Router>
    );
    getByText('nameTest');
    getByText('catTest');

    expect(container.firstChild).toHaveAttribute('href', '/restaurant/1');
  });
});
