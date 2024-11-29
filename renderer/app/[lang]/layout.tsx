import React from 'react';
import styles from './lang.module.css';

export async function generateStaticParams(): Promise<{
  params: {
      lang: string;
  };
}[]> {
  return [
    { params: { lang: 'en_US' } },
    { params: { lang: 'pt_BR' } },
  ];
}

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }): Promise<React.ReactElement> {
  const param = (await params);
  return <div id={styles.langPage}>
    <h1>{param.lang}</h1>
    {children}
  </div>;
}
