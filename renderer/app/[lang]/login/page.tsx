'use client';
import { ErrorBox, List, UserInput, UserInputFactory } from '../../components';
import { useParams, useRouter } from 'next/navigation';
import { pingServer, submitForm } from './submit';
import React, { useState } from 'react';
import styles from './login.module.css';

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login(): React.ReactElement {
  const param = useParams<{ lang: string }>();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [connectedToServer, setConnectedToServer] = useState(false);
  
  const onServerFormSubmit = async (serverIp: string): Promise<void> => {
    setErrorMessage('');
    setSubmitted(true);
    const result = await pingServer(serverIp);
    setSubmitted(false);
    if (result.status >= 300) setErrorMessage(JSON.stringify(result.data));
    else setErrorMessage('');
    setConnectedToServer(result.status < 300);
  };

  const onLoginFormSubmit = async (serverIp: string, email: string, password: string): Promise<void> => {
    setErrorMessage('');
    setSubmitted(true);
    const result = await submitForm(serverIp, email, password);
    setSubmitted(false);
    if (result.status >= 300) setErrorMessage(JSON.stringify(result.data.message ?? result.data));
    else router.push(`/${param.lang}/home`);
  };

  const [getServerIp, ServerIpComponent] = UserInputFactory({
    type: 'text',
    title: 'Server IP',
    loading: submitted,
    onSubmit: onServerFormSubmit,
  });

  let getPassword: () => string;

  const [getEmail, EmailInput] = UserInputFactory({
    type: 'text',
    title: 'Email',
    loading: submitted,
    onSubmit: (email: string) => {
      onLoginFormSubmit(getServerIp(), email, getPassword());
    },
  });

  const PasswordProduct = UserInputFactory({
    type: 'password',
    title: 'Senha',
    loading: submitted,
    onSubmit: (password: string) => {
      onLoginFormSubmit(getServerIp(), getEmail(), password);
    },
  });
  getPassword = PasswordProduct[0];
  const PasswordInput = PasswordProduct[1];

  return <div id={styles.loginPage}>
    {!connectedToServer ?
      <div key={'serverForm'} className={styles.loginForm}>
        <h1 className={styles.formTitle}>Connect to Server</h1>
        <ErrorBox key={'ErrorBox'} message={errorMessage} visible={!!errorMessage}/>
        <List items={[
          ServerIpComponent,
          <UserInput
            type='submit'
            title='Next'
            disabled={ getServerIp().length < 8 }
            tabIndex={0}
            loading={submitted}
            onClick={async () => { await onServerFormSubmit(getServerIp()); }}
          />,
        ]}/>
      </div>
      : 
      <div key={'loginForm'} className={styles.loginForm}>
        <UserInput type='button' title='<' onClick={async () => { setConnectedToServer(false); }} tabIndex={0} align='left' simpleDesign={true}/>
        <h1 className={styles.formTitle}>Login</h1>
        <ErrorBox key={'ErrorBox'} message={errorMessage} visible={!!errorMessage}/>
        <List items={[
          EmailInput,
          PasswordInput,
          <UserInput
            type='submit'
            title='Login'
            tabIndex={0}
            loading={submitted}
            onClick={async () => { await onLoginFormSubmit(getServerIp(), getEmail(), getPassword()); }}
            disabled={ getEmail().length < 3 || getPassword().length < 8 || !isEmailValid(getEmail()) }
          />,
        ]}/>
      </div>
    }
  </div>;
}
