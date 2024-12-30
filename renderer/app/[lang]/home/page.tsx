'use client';
import { Chat, List, SplitScreen, UserConfigBox } from '../../components';
import React, { ReactElement } from 'react';
import styles from './home.module.css';

export default function Page(): ReactElement {
  return (
    <div id={styles.homePage}>
      <List items={[]}/>
      <div id={styles.channelListWrapper}>
        <List items={[]}/>
        <UserConfigBox/>
      </div>
      <SplitScreen
        sizePercentage={0.35}
        leftItem={<Chat/>}
        rightItem={<Chat/>}
      />
    </div>
  );
}
