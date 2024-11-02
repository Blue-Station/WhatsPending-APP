'use client';

import React, { useState } from 'react';
import styles from './modal.module.css';

export interface IModalBuilderProperties {
  submitText: string,
  submitColor?: string,
  cancelText?: string,
  cancelColor?: string,
  onSubmit: () => void,
  onCancel?: () => void,
  cancelable?: boolean,
  InvertedsubmitCondition?: boolean,
}

export interface IModalProperties extends IModalBuilderProperties {
  children: React.ReactNode,
  show?: boolean,
}

export function Modal({ children, submitText, onSubmit, onCancel, cancelable, show, InvertedsubmitCondition, cancelText = 'Cancelar', submitColor, cancelColor }: IModalProperties): React.ReactElement {
  return (<div id={styles.modalContainer} className={show ? styles.open : ''} style={ { '--accent-color': submitColor, '--negate-color': cancelColor } as any }>
    <dialog open={show} id={styles.modalItem}>
      {cancelable && <button onClick={(): void => { onCancel(); }} id={styles.closeModalButton}>
        <div id={styles.closePart}></div>
        <div id={styles.closePart}></div>
      </button>}
      {children}
      <form method="dialog" id={styles.inputAreas}>
        {cancelable && <button onClick={ (): void => { onCancel(); }} className={styles.modalButton}>{cancelText}</button>}
        <button onClick={ (): void => { onSubmit(); }} className={[styles.modalButton, styles.mainAction].join(' ')} disabled={InvertedsubmitCondition}>{submitText}</button>
      </form>
    </dialog>
  </div>);
}

export function modalBuilder(
  { submitText, onSubmit, onCancel, cancelable, InvertedsubmitCondition, html, cancelText = 'Cancelar', submitColor, cancelColor }: IModalBuilderProperties & { html: React.ReactElement },
): { html: React.ReactElement, show: (extraCallback?: () => void) => void, hide: () => void } {
  const [open, setOpen] = useState(false);
  const [extraCallback, setExtraCallback] = useState<() => void>(null);

  return {
    html: <Modal
      submitText={submitText}
      submitColor={submitColor}
      cancelText={cancelText}
      cancelColor={cancelColor}
      onSubmit={(): void => { setOpen(false); onSubmit(); if (extraCallback) extraCallback(); }}
      onCancel={(): void => { setOpen(false); if (onCancel) onCancel(); }}
      cancelable={cancelable}
      show={open}
      InvertedsubmitCondition={InvertedsubmitCondition}
    >
      {html}
    </Modal>,
    show: (extraCallback?: () => void): void => {
      setOpen(true);
      // eslint-disable-next-line unicorn/consistent-function-scoping
      setExtraCallback((): (() => void) => () => {
        if (extraCallback) extraCallback();
      });
    },
    hide: (): void => setOpen(false),
  };
}
