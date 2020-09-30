// import Enzyme, { shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-15';

import React from 'react';
import { render } from '@testing-library/react';
import Input from '../components/Input/Input';

const testValue = Math.floor(Math.random() * 10) + 1;
const setup = () => {
  const utils = render(
    <Input
      id="test"
      label="test"
      type="number"
      value={testValue}
      onChange={(e) => console.log(e.target.value)}
    />
  );
  const input = utils.getByLabelText('test');
  return {
    input,
    ...utils,
  };
};

test('Input contains correct value', () => {
  const { input } = setup();
  expect(Number(input.value)).toBe(testValue);
});
