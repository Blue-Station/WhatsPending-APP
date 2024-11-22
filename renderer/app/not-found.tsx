import React from 'react';
import Link from 'next/link';

export default function notFound(): React.ReactElement {
  return (<div>
    <h1>404</h1>
    <Link href='/a/login'>Ir para login</Link>
  </div>);
}
