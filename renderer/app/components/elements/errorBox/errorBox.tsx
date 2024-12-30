import React from 'react';
import styles from './errorBox.module.css';

export interface IErrorBox {
  message: string;
  visible?: boolean;
}

export function ErrorBox(props: IErrorBox): React.ReactNode {
  return (<div className={`${styles.container} ${props.visible ? styles.visible : ''}`}>
    <div className={styles.errorBox}>
      <span>{props.message ?? 'Unknown Error'}</span>
    </div>
  </div>);
}
