'use client';
import FormInput from '../../components/formInput/formInput';
import styles from './login.module.css';
import React, { useState} from 'react';
import { submitForm } from './submit';

export default function Login(): React.ReactElement {
  const [submited, setSubmited] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return <div id={styles.loginPage}>
    <div id={styles.loginForm}>
      <div tabIndex={1}>
        <FormInput type='text' placeholder='Username' onChange={(value) => { setUsername(value); }} loading={submited}/>
      </div>
      <div tabIndex={2}>
        <FormInput type='password' placeholder='Password' onChange={(value) => { setPassword(value); }} loading={submited}/>
      </div>
      <FormInput type='button' placeholder='Login' disabled={ username.length < 3 || password.length < 8 } onClick={async () => {
        setSubmited(true);
        const result = await submitForm(username, password);
        setSubmited(false);
        if (result) {
          alert('Login successful');
        } else {
          alert('Login failed');
        }
      }} />
    </div>
  </div>;
}
