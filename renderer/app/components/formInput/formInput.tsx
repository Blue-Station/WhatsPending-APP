'use client';

import React, { useState, HTMLInputTypeAttribute, useEffect, useRef } from 'react';
import styles from './formInput.module.css';

export interface IFormInputProps {
  type: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => Promise<void>;
  required?: boolean;
  tabIndex?: number;
}

export function FormInput(props: IFormInputProps): React.ReactNode {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-undef
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  return (
    <div className={`${styles.formInput} ${loading ? styles.loading : ''}`}>
      <div className={styles.loadingBox}>
        <div className={styles.loadingSpinner}></div>
        <span>{(props.type === 'password' ? '*'.repeat(inputRef.current?.value.length) : inputRef.current?.value) ?? props.placeholder}</span>
      </div>
      { props.type !== 'button' && props.type !== 'submit' ? <label className={styles.inputTitle}>{props.placeholder}</label> : null }
      <input
        className={styles.inputBox}
        type={props.type}
        value={props.type === 'button' || props.type === 'submit' ? props.placeholder : props.value}
        title={props.placeholder}
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
      />
    </div>
  );
}
