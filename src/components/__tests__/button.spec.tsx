import { render } from '@testing-library/react';
import React from 'react';
import { Button } from '../button';

describe('<Button />', () => {
  it('should render OK with props', () => {
    const { getByText, rerender, container } = render(
      <Button canClick={true} loading={false} actionText={'test'}></Button>
    );
    getByText('test');
    rerender(
      <Button canClick={true} loading={true} actionText={'test'}></Button>
    );
    getByText('Loading');
    expect(container.firstChild).toHaveClass('bg-lime-500 hover:bg-lime-600');
    rerender(
      <Button canClick={false} loading={true} actionText={'test'}></Button>
    );
    expect(container.firstChild).toHaveClass('bg-gray-300 pointer-events-none');
  });
});
