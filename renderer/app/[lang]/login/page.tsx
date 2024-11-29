'use client';
import FormInput from '../../components/formInput/formInput';
import ErrorBox from '../../components/errorBox/errorBox';
import { pingServer, submitForm } from './submit';
import React, { useEffect, useState } from 'react';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login(): React.ReactElement {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const [connectedToServer, setConnectedToServer] = useState(false);
  const [serverIP, setServerIP] = useState('');

  const [submited, setSubmited] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const store = (globalThis as any).store;
    const loginStore = store.createStore('user');
    loginStore.set('email', email);
    loginStore.set('password', password);
    loginStore.set('serverIP', serverIP);
  });

  return <div id={styles.loginPage}>
    {!connectedToServer ?
      <form key={'serverForm'} className={styles.loginForm} onSubmit={async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSubmited(true);
        if (!serverIP.startsWith('http')) setServerIP(`https://${serverIP}`);
        const result = await pingServer(serverIP);
        setSubmited(false);
        if (result.status >= 300) setErrorMessage(JSON.stringify(result.data));
        else setErrorMessage('');
        setConnectedToServer(result.status < 300);
        return false;
      }}>
        <h1 className={styles.formTitle}>Connect to Server</h1>
        { errorMessage ? <ErrorBox key={'ErrorBox'} message={errorMessage}/> : null }
        <FormInput type='text' placeholder='Server IP' onChange={(value) => { setServerIP(value); }} loading={submited} tabIndex={0}/>
        <FormInput type='submit' placeholder='Next' disabled={ serverIP.length < 8 } tabIndex={0} loading={submited} />
      </form>
      : 
      <form key={'loginForm'} className={styles.loginForm} onSubmit={async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSubmited(true);
        const result = await submitForm(serverIP, email, password);
        setSubmited(false);
        if (result.status >= 300) {
          setErrorMessage(JSON.stringify(result.data.message ?? result.data));
        } else {
          setErrorMessage('');
          router.push('/a/home');
        };
        return false;
      }}>
        <h1 className={styles.formTitle}>Login</h1>
        { errorMessage ? <ErrorBox key={'ErrorBox'} message={errorMessage}/> : null }
        <FormInput type='email' placeholder='Email' onChange={(value) => { setEmail(value); }} loading={submited} tabIndex={0}/>
        <FormInput type='password' placeholder='Password' onChange={(value) => { setPassword(value); }} loading={submited} tabIndex={0}/>
        {/* FIXME: Better way to check if email is valid */}
        <FormInput type='submit' placeholder='Login' disabled={ email.length < 3 || password.length < 8 || !isEmailValid(email) } tabIndex={0} loading={submited} />
      </form>
    }
  </div>;
}
