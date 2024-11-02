// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styles from './selectionModal.module.css';
import { modalBuilder } from '../modal/modal';
import Store from 'electron-store';
import Image from 'next/image.js';

export interface ISelectElement {
  id: string | number,
  title: string,
  description?: string,
  imagePath?: string // TODO: this
}

export interface ISelectionModal {
  items: ISelectElement[],
  prompt: string,
  cancelable: boolean,
  storageKey?: string,
  callback: (response: ISelectElement) => void
}

export default function selectionModal({ items, prompt, cancelable, storageKey, callback }: ISelectionModal): { modal: {html: React.ReactElement, show: () => void, hide: () => void}, readedDB: boolean } {
  const [selectedItem, setSelectedItem] = useState<ISelectElement>(null);
  const [readedDB, setReadedDB] = useState<boolean>(false);

  const modal = modalBuilder({
    html: (<div className={styles.selectionModal}>
      <h1>{prompt}</h1>
      <div className={styles.itemsBox}>
        {items.map((item, index) => (
          <div key={index} className={[styles.selectionItem, selectedItem?.id === item.id ? styles.selectedItem : ''].join(' ')} onClick={(): void => setSelectedItem(item)}>
            {
              item.imagePath
                ? <div className={styles.selectionItemImageContainer}>
                  <Image src={item.imagePath} alt={item.title} width={500} height={500}/>
                </div>
                : null
            }
            <h1 className={styles.selectionTitle}>{item.title}</h1>
            <div className={styles.selectionDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>),
    submitText: 'Selecionar',
    onSubmit: () => {
      // check if theres an selected item
      if (!selectedItem) return;

      const storedData: Store = (globalThis as any).store.createStore({
        name: storageKey,
      });

      storedData.set(storageKey, selectedItem);
      callback(selectedItem);
      modal.hide();
    },
    InvertedsubmitCondition: selectedItem === null,
    cancelable,
  });

  useEffect(() => {
    if (!storageKey) return;
    if (items.length === 0) return;

    // check if storage key has any data
    const storedData: Store = (globalThis as any).store.createStore({
      name: storageKey,
    });

    const storedKey = storedData.get(storageKey) as ISelectElement;
    if (!storedKey) {
      setSelectedItem(null);
      return setReadedDB(true);
    }

    const isValid = items.find(item => item.id === storedKey.id);
    if (!isValid) {
      setSelectedItem(null);
      console.log('Não é válido');
      return setReadedDB(true);
    }

    modal.hide();
    setSelectedItem(storedKey);
    callback(storedKey);
    setReadedDB(true);

    return (): void => {
      setReadedDB(false);
    };
  }, [items.length > 0]);

  return {
    modal,
    readedDB,
  };
}
