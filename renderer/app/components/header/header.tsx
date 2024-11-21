'use client';

import React from 'react';
import styles from './header.module.css';

export default function Header(): React.ReactElement {
  return (
    <div id={styles.headerTop}>
      <div id={styles.draggableRegion}></div>
      <div id={styles.headerContent}>
        <div id={styles.leftSide}>
          <h1 id={styles.appTitle}>Whats&lt;Pending&gt;</h1>
        </div>
        <div id={styles.rightSide}>
        </div>
      </div>
    </div>
  );
}
