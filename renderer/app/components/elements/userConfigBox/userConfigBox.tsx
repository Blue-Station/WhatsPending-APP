'use client';

import * as cookieStore from '../../utils/cookieHandler/cookieHandler';
import { UserInput } from '../UserInput';
import styles from './userConfigBox.module.css';
import Image from 'next/image';
import React from 'react';

export interface IUserConfigBox {
  onClick: () => void;
}

export function UserConfigBox(props: IUserConfigBox): React.ReactElement {
  return (<div id={styles.userProfile}>
    <button id={styles.userIcon} onClick={props.onClick}>
      <div className={styles.profilePic}>
        <Image className={styles.profileImg} src="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg" alt="Profile Picture" width={60} height={60}/>
      </div>
    </button>
    <div id={styles.UserConfigBox}>
      <div id={styles.UserConfigInfo}>
        <div className={styles.profilePic}>
          <Image className={styles.profileImg} src="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg" alt="Profile Picture" width={60} height={60}/>
        </div>
        <div id={styles.textArea}>
          <span id={styles.profileName}>Nome Sobrenome</span>
          <span id={styles.status}>Olá! tudo bem? Que legal</span>
        </div>
        <div className={styles.bottomOptions}>
          <UserInput loading={false} simpleDesign={true} primaryColor='#aaa' secondaryColor='#444499' align='fill' type='button' className={styles.logOutButton} onClick={async () => {
            await cookieStore.remove('accessToken');
            await cookieStore.remove('refreshToken');
            await cookieStore.remove('serverIP');
            await cookieStore.remove('email');
          }}>
            <div className={styles.ChangeAccount}>
              <div className={styles.arrowBack}>
                <div className={styles.arrowBackPart}/>
                <div className={styles.arrowBackPart}/>
              </div>
              <span>Trocar Conta</span>
            </div>
          </UserInput>
          <UserInput loading={false} simpleDesign={true} primaryColor='#aaa' secondaryColor='#444499' align='fill' type='button' className={styles.logOutButton} onClick={async () => {
            await cookieStore.remove('accessToken');
            await cookieStore.remove('refreshToken');
            await cookieStore.remove('serverIP');
            await cookieStore.remove('email');
          }}>
            <div className={styles.icon}>
              <Image src="/images/settingsIcon.svg" alt="settings" width={20} height={20}/>
            </div>
          </UserInput>
        </div>
      </div>
    </div>
  </div>);
}
