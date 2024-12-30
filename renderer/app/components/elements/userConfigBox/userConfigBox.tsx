'use client';

import { List } from '../..';
import * as cookieStore from '../../utils/cookieHandler/cookieHandler';
import styles from './userConfigBox.module.css';
import Image from 'next/image';
import React from 'react';

export function UserConfigBox(): React.ReactElement {
  return (<div id={styles.UserConfigBox}>
    <button id={styles.profileMenu} onClick={async () => {
      await cookieStore.remove('accessToken');
      await cookieStore.remove('refreshToken');
      await cookieStore.remove('serverIP');
      await cookieStore.remove('email');
    }}>
      <div id={styles.profilePic}>
        <Image id={styles.profileImg} src="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg" alt="Profile Picture" width={60} height={60}/>
      </div>
      <div id={styles.textArea}>
        <span id={styles.profileName}>Nome Sobrenome</span>
        <span id={styles.status}>Olá! tudo bem? Que legal</span>
      </div>
    </button>
  </div>);
}
