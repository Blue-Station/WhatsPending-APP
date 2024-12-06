import { redirect } from 'next/navigation';
import React from 'react';

export default function notFound(): React.ReactElement {
  redirect('/a/home');
  return (<div>
    <h1>404</h1>
  </div>);
}
