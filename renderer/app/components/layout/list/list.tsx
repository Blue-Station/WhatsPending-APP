import React from 'react';
import styles from './list.module.css';

interface IListProps {
  items: React.ReactElement[];
}

export function List(props: IListProps): React.ReactElement {
  return (
    <div className={styles.list}>
      {props.items}
    </div>
  );
}
