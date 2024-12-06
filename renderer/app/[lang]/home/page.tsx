'use client';
import { List, SplitScreen, UserConfigBox } from '../../components';
import React, { ReactElement } from 'react';
import styles from './home.module.css';

export default function Page(): ReactElement {
  return (
    <div id={styles.homePage}>
      <List/>
      <div id={styles.channelListWrapper}>
        <List/>
        <UserConfigBox/>
      </div>
      <SplitScreen />
    </div>
  );
}
