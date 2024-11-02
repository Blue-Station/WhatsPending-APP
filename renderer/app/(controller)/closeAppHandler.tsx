'use client';
import { modalBuilder } from '../components/modal/modal';
import { ReactElement, useEffect } from 'react';

export default function CloseAppHandler(): ReactElement {
  const closeModal = modalBuilder({
    html: (
      <center>
        <h1>Você realmente quer fechar o aplicativo?</h1>
        <br/>
        <p>O modo apresentação ainda está ativo, portanto, fechar o aplicativo também encerrará a apresentação!</p>
      </center>
    ),
    submitText: 'Sim',
    submitColor: '#cc3333',
    cancelText: 'Não',
    onSubmit: () => { ((globalThis as any).ipc)?.send('app.stop.answer', true); },
    cancelable: true,
  });

  useEffect(() => {
    ((globalThis as any).ipc)?.on('app.stop.ask', () => {
      closeModal.show();
    });

    return (): void => {
      ((globalThis as any).ipc)?.removeAllListeners('app.stop.ask');
    };
  });

  return closeModal.html;
}
