import React from 'react';
import styles from './list.module.css';

interface IListProps {
  items: React.ReactElement[];
  additionalClass?: string;
  additionalIndexClass?: [string, number][];
  pinAtEnd?: React.ReactElement[];
}

export function List(props: IListProps): React.ReactElement {
  const items = [...props.items];
  if (props.items.length === 0) items.push(<br />);
  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        return (<div className={`${styles.listItem} ${props.items.length > 0 ? (props.additionalClass ?? '') : ''} ${
          props.items.length === 0 ? '' : props.additionalIndexClass?.find((item) => { return item[1] === index; })?.[0] ?? ''
        }`} key={index}>
          {item}
        </div>);
      })}
      {props.pinAtEnd?.map((item, index) => {
        return (<div className={`${styles.listItem} ${props.additionalClass ?? ''} ${
          props.additionalIndexClass?.find((item) => { return item[1] === (props.items.length + index); })?.[0] ?? ''
        }`} key={'pb-' + index}>
          {item}
        </div>);
      })}
    </div>
  );
}
