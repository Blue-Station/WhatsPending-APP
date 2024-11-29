'use client';
import React, { ReactElement, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './home.module.css';
import Link from 'next/link';

export default function Page(): ReactElement {
  const param = useParams<{ lang: string }>();
  useEffect(() => {
    const store = (globalThis as any).store;
    const loginStore = store.createStore('user');
  });
  return (
    <div id={styles.homePage}>
      <h1>{param.lang}</h1>
      <Link href='/a/login'>DEBUG</Link>
    </div>
  );
}
