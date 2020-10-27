import React from 'react';

import Button from '../Button/Button';
import './header.css';

export interface HeaderProps {
  user?: {};
}

export const Header: React.FC<HeaderProps> = ({ user }) => (
  <header>
    <div className="wrapper">
      <div>
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="logo" width="32" height="32" />
        <h1>Framer</h1>
      </div>
      <div>
        {user ? (
          <Button size="small" label="Log out" />
        ) : (
          <>
            <Button size="small" label="Log in" />
            <Button primary size="small" label="Sign up" />
          </>
        )}
      </div>
    </div>
  </header>
);
