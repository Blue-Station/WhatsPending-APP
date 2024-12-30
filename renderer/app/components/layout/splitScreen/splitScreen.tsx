import React from 'react';
import styles from './splitScreen.module.css';

interface ISplitScreenProps {
  leftItem: React.ReactElement;
  rightItem: React.ReactElement;
  sizePercentage: number;
}

export function SplitScreen(props: ISplitScreenProps): React.ReactElement {
  return (
    <div style={{ '--percentage': props.sizePercentage } as any} className={styles.splitScreen}>
      <div className={styles.leftItem}>
        {props.leftItem}
      </div>
      <div className={styles.rightItem}>
        {props.rightItem}
      </div>
    </div>
  );
}
