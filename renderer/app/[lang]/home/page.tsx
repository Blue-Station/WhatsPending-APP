'use client';
import { ReactElement } from 'react';
import styles from './home.module.css';
import Link from 'next/link';

export default function Page(): ReactElement {
  return (
    <div id={styles.homePage}>
      <Link href='/login'>DEBUG</Link>
    </div>
  );
}
