'use client';
import { Chat, List, SplitScreen, UserConfigBox } from '../../components';
import React, { ReactElement, useState } from 'react';
import styles from './home.module.css';
import { ServerIcon } from '../../components/elements/serverIcon/serverIcon';

export default function Page(): ReactElement {
  const amountOfServers = 1;
  const [currentServer, setCurrentServer] = useState(0);
  const [userPanelOpen, setUserPanelOpen] = useState(false);

  return (
    <div id={styles.homePage}>
      <div id={styles.leftSide}>
        <div id={styles.ServerListWrapper} style={{ '--selectedServer': currentServer } as any}>
          <List
            additionalClass={styles.serverListItem}
            additionalIndexClass={[
              [styles.selectedServer, currentServer],
              [styles.selectedServer, userPanelOpen ? amountOfServers : -1],
            ]}
            items={[
              <ServerIcon name="Mensagens Privadas" icon="/images/Message.svg" showBg={true} />,
            ]}
            pinAtEnd={[
              <UserConfigBox onClick={() => { setUserPanelOpen(!userPanelOpen); }}/>,
            ]}
          />
        </div>
        <List items={[]}/>
      </div>
      <SplitScreen
        sizePercentage={0.35}
        leftItem={<Chat/>}
        rightItem={<Chat/>}
      />
    </div>
  );
}
