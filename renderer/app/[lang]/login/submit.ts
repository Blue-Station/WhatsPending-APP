'use server';
import { CookieHandler } from '../../components';

export interface IRequestResult {
  status: number;
  data?: any;
}

export async function pingServer(serverIP: string): Promise<IRequestResult> {
  'use server';
  return new Promise(async (resolve) => {
    if (!serverIP.startsWith('http')) serverIP = `https://${serverIP}`;
    const request = await fetch(`${serverIP}/ping`, {
      method: 'GET',
    }).catch((error) => {
      console.log(error);
      return resolve({ status: 400, data: 'Invalid Server' });
    });
    if (!request) return resolve({ status: 400, data: 'Invalid Server' });
    const data = await request.json().catch(() => {
      return resolve({ status: request.status, data: 'Invalid Server' });
    });
    if (!data) return resolve({ status: 400, data: 'Invalid Server' });

    if (data.type !== 'WhatsPendingServer') return resolve({ status: request.status, data: 'Invalid Server' });
  
    return resolve({ status: request.status, data });
  });
}

export async function submitForm(serverIP: string, email: string, password: string): Promise<IRequestResult> {
  'use server';
  return new Promise(async (resolve) => {
    const request = await fetch(`${serverIP}/user/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).catch((error) => {
      console.log(error);
      return resolve({ status: 400, data: 'Invalid Credentials' });
    });

    if (!request) return resolve({ status: 400, data: 'Invalid Credentials' });
    const data = await request.json();

    await CookieHandler.set('accessToken', (data.accessToken as string), new Date(Number(data.accessTokenExpires)));
    await CookieHandler.set('refreshToken', (data.refreshToken as string), new Date(Number(data.refreshTokenExpires)));
    await CookieHandler.set('serverIP', serverIP);
    await CookieHandler.set('email', email);
    
    return resolve({ status: request.status, data });
  });
}
