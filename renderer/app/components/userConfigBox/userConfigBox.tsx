'use client';

import * as cookieStore from '../../components/cookieHandler/cookieHandler';
import styles from './userConfigBox.module.css';
import Image from 'next/image';
import React from 'react';

export function UserConfigBox(): React.ReactElement {
  return (<div>
    <button id={styles.profileMenu} onClick={async () => {
      await cookieStore.remove('accessToken');
      await cookieStore.remove('refreshToken');
      await cookieStore.remove('serverIP');
      await cookieStore.remove('email');
    }}>
      <div id={styles.profilePic}>
        <Image src="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg" alt="Profile Picture" width={60} height={60}/>
      </div>
      <span id={styles.profileName}>Adalberto Pereira</span>
      <div></div>
    </button>
  </div>);
}
