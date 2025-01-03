'use client';

import React, { useEffect } from 'react';
import styles from './header.module.css';

export function Header(): React.ReactElement {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const computedStyles = globalThis.getComputedStyle(document.documentElement);
    (globalThis as any).ipc.send('setTitleBarOverlay', {
      color: computedStyles.getPropertyValue('--gray-800'),
      symbolColor: computedStyles.getPropertyValue('--white'),
      height: computedStyles.getPropertyValue('--header-height'),
    });
  });
  return (
    <div id={styles.headerTop}>
      <div id={styles.draggableRegion}></div>
      <div className={styles.NativeControlsArea}></div>
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
