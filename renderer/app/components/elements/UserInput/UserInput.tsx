'use client';

import React, { useState, HTMLInputTypeAttribute, useEffect, useRef } from 'react';
import styles from './UserInput.module.css';

export interface IUserInputProps {
  type: HTMLInputTypeAttribute;
  value?: string;
  title?: string;
  primaryColor?: string;
  secondaryColor?: string;
  align?: 'left' | 'center' | 'right' | 'fill';
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  simpleDesign?: boolean;
  tabIndex?: number;
  className?: string;
  onSubmit?: (value: string) => void;
  onChange?: (newValue: string) => void;
  onClick?: () => Promise<void>;
  children?: React.ReactNode;
}

export function UserInput(props: IUserInputProps): React.ReactNode {
  let alignment = styles.rightAlign;
  if (props.align === 'center') alignment = styles.centerAlign;
  if (props.align === 'left') alignment = styles.leftAlign;
  if (props.align === 'fill') alignment = styles.fillAlign;
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-undef
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  return (
    <div
      className={`${styles.UserInput} ${props.simpleDesign ? styles.simple : ''} ${loading ? styles.loading : ''} ${alignment} ${props.className ?? ''}`}
      style={{ '--primary-color': props.primaryColor ?? 'unset', '--secondary-color': props.secondaryColor ?? 'unset' } as any}
    >
      <div className={styles.loadingBox}>
        <div className={styles.loadingSpinner}></div>
        <span>{(props.type === 'password' ? '*'.repeat(inputRef.current?.value.length) : inputRef.current?.value) ?? props.children ?? props.title}</span>
      </div>
      { !props.children && props.type !== 'button' && props.type !== 'submit' && props.type !== 'reset' ? <label className={styles.inputTitle}>{props.title}</label> : null }
      {props.children ?
        <button
          className={styles.inputBox}
          title={props.title}
          disabled={props.disabled}
          tabIndex={props.tabIndex ?? 0}
          onClick={() => {
            if (props.type !== 'button' && props.type !== 'submit' && props.type !== 'reset') return;
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
        >{props.children}</button>
        :
        <input
          className={styles.inputBox}
          type={props.type}
          value={props.type === 'button' || props.type === 'submit' || props.type === 'reset' ? props.title : props.value}
          title={props.title}
          onChange={(e) => { if (props.onChange) props.onChange(e.target.value); }}
          placeholder=' '
          disabled={props.disabled}
          ref={inputRef}
          tabIndex={props.tabIndex ?? 0}
          onClick={() => {
            if (props.type !== 'button' && props.type !== 'submit' && props.type !== 'reset') return;
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
      }
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
