'use client';

import React, { useState, HTMLInputTypeAttribute, useEffect, useRef } from 'react';
import styles from './UserInput.module.css';

export interface IUserInputProps {
  type: HTMLInputTypeAttribute;
  value?: string;
  title?: string;
  align?: 'left' | 'center' | 'right';
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  simpleDesign?: boolean;
  tabIndex?: number;
  className?: string;
  onSubmit?: (value: string) => void;
  onChange?: (newValue: string) => void;
  onClick?: () => Promise<void>;
}

export function UserInput(props: IUserInputProps): React.ReactNode {
  const alignment = props.align ?? 'right';
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-undef
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  return (
    <div 
      className={`${styles.UserInput} ${props.simpleDesign ? styles.simple : ''} ${loading ? styles.loading : ''} ${alignment === 'center' ? 
        styles.centerAlign : 
        (alignment === 'left' ? styles.leftAlign : styles.rightAlign)
      } ${props.className ?? ''}`}
    >
      <div className={styles.loadingBox}>
        <div className={styles.loadingSpinner}></div>
        <span>{(props.type === 'password' ? '*'.repeat(inputRef.current?.value.length) : inputRef.current?.value) ?? props.title}</span>
      </div>
      { props.type !== 'button' && props.type !== 'submit' ? <label className={styles.inputTitle}>{props.title}</label> : null }
      <input
        className={styles.inputBox}
        type={props.type}
        value={props.type === 'button' || props.type === 'submit' ? props.title : props.value}
        title={props.title}
        onChange={(e) => { if (props.onChange) props.onChange(e.target.value); }}
        placeholder=' '
        disabled={props.disabled}
        ref={inputRef}
        tabIndex={props.tabIndex ?? 0}
        onClick={() => {
          if (props.type !== 'button' && props.type !== 'submit') return;
          if (props.onClick) {
            setLoading(true);
            props.onClick().finally(() => setLoading(false));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && props.onSubmit) {
            props.onSubmit(inputRef.current?.value ?? '');
          }
        }}
      />
    </div>
  );
}

export function UserInputFactory(props: IUserInputProps): [getValue: () => string, React.ReactElement] {
  const [value, setValue] = useState(props.value ?? '');

  return [
    (): string => value,
    <UserInput
      {...props}
      value={value}
      onChange={(newValue) => { setValue(newValue); if (props.onChange) props.onChange(newValue); }}
      onSubmit={(newValue) => { setValue(newValue); if (props.onSubmit) props.onSubmit(newValue); }}
    />,
  ];
}
