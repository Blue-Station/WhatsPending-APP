import styles from './lang.module.css';
import React from 'react';

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }): Promise<React.ReactElement> {
  return <div id={styles.langPage}>
    {children}
  </div>;
}
