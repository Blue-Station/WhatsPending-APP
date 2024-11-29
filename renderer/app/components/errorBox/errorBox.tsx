import React from 'react';
import styles from './errorBox.module.css';

export interface IErrorBox {
  message: string;
}

export default function ErrorBox(props: IErrorBox): React.ReactNode {
  return (<div className={styles.errorBox}>
    <span>{props.message}</span>
  </div>);
}
