import Image from 'next/image';
import React from 'react';
import styles from './serverIcon.module.css';

export interface IServerIconProps {
  name: string;
  icon: string;
  showBg?: boolean;
  bgColor?: string;
}

export function ServerIcon(props: IServerIconProps): React.ReactElement {
  return (
    <div className={styles.serverIcon}>
      <div className={props.showBg ? styles.showBg : ''} style={{ '--bg-color': props.bgColor } as any}/>
      <Image className={styles.imageWrapper} src={props.icon} alt={`Servidor: ${props.name}`} width={150} height={150} />
      <div className={styles.tooltip}>
        <span className={styles.text}>{props.name}</span>
      </div>
    </div>
  );
} 
