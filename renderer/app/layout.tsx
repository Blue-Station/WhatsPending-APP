import CloseAppHandler from './closeAppHandler';
import styles from './general.module.css';
import { Header } from './components';
import React from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html unselectable='on'>
      <head>
        <title>Whats&lt;Pending&gt;</title>
      </head>
      <body>
        <div id='appContainer'>
          <Header />
          <CloseAppHandler />
          <div id={styles.controlContainer}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
