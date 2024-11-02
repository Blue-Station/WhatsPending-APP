'use client';

import selectionModal, { ISelectElement } from '../../../../components/selectionModal/selectionModal';
import { modalBuilder } from '../../../../components/modal/modal';
import React, { useEffect, useState } from 'react';
import styles from './selectScreen.module.css';
import { useRouter } from 'next/navigation';

interface IScreen {
  id: number,
  name: string,
  size: {
    width: number,
    height: number
  }
}

export default function Controller({ children }: { children: React.ReactElement }): React.ReactElement {
  const [selectedExhibition, setSelectedExhibition] = useState<any>({ id: -1 });
  const [selectedController, setSelectedController] = useState<any>({ id: -1 });
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [screens, setScreens] = useState<IScreen[]>([]);
  const router = useRouter();

  const closeModal = modalBuilder({
    html: (
      <center>
        <h1>Você realmente quer parar a apresentação?</h1>
        <br/>
        <p>O modo apresentação ainda está ativo, isso encerrará a apresentação!</p>
      </center>
    ),
    submitText: 'Sim',
    submitColor: '#cc3333',
    cancelText: 'Não',
    onSubmit: () => {
      setIsPresenting(false);
      ((globalThis as any).ipc)?.send('exhibition.stop');
    },
    cancelable: true,
  });

  function startPresentation(): void {
    const ipc = (globalThis as any)?.ipc;
    setIsPresenting(true);
    if (screens.length === 1) return ipc.send('exhibition.start', selectedExhibition.id);
    ipc.send('controller.move', selectedController.id);
    ipc.send('exhibition.start', selectedExhibition.id);
  }

  function stopPresentation(extraCallBack?: () => void): void {
    closeModal.show(extraCallBack);
  }

  const chooseControllerScreen = selectionModal({
    items: screens.filter((item) => item.id !== selectedExhibition.id).map((item) => ({
      id: item.id,
      title: item.name,
      description: `${item.size.width}x${item.size.height}`,
    })) as ISelectElement[],
    prompt: 'Selecione uma Tela de Controle',
    storageKey: 'controllerScreen',
    cancelable: false,
    callback: (selectedScreen) => {
      setSelectedController(selectedScreen);
    },
  });

  const chooseExhibitionScreen = selectionModal({
    items: screens.map((item) => ({
      id: item.id,
      title: item.name,
      description: `${item.size.width}x${item.size.height}`,
    })) as ISelectElement[],
    prompt: 'Selecione uma Tela de Exibição',
    storageKey: 'exhibitionScreen',
    cancelable: false,
    callback: (selectedScreen) => {
      setSelectedExhibition(selectedScreen);
      if (screens.length !== 2) return chooseControllerScreen.modal.show();
      setSelectedController(screens.find((item) => item.id !== selectedScreen.id));
    },
  });

  // app.getScreens
  useEffect(() => {
    const ipc = (globalThis as any)?.ipc;
    const alert = (globalThis as any)?.alert;

    ipc?.once('app.getScreens.return', ([data]: any[]) => {
      if (!data || data.length === 0) return router.push('/home');

      ipc?.once('exhibition.start.error', () => {
        alert(`Error starting exhibition screen!`);
        setIsPresenting(false);
      });

      setScreens(data);
      if (!selectedExhibition.id || selectedExhibition.id < 0) {
        setSelectedExhibition({});
        setSelectedController({});
        chooseExhibitionScreen.modal.show();
      }
    });

    ipc?.send('app.getScreens');

    return (): void => {
      ipc?.removeAllListeners('app.getScreens.return');
      ipc?.removeAllListeners('exhibition.start.error');
    };
  }, []);

  return <div id={styles.selectScreen}>
    {children}
    {closeModal.html}
    {(screens.length > 1 && !(selectedController.id && selectedExhibition.id) && (chooseExhibitionScreen.readedDB && chooseControllerScreen.readedDB)) &&
      <>
        {chooseControllerScreen.modal.html}
        {chooseExhibitionScreen.modal.html}
      </>
    }
    <div id={styles.controlBar}>
      <div id={styles.left}>
        <button disabled={isPresenting} className={styles.controlButton} onClick={(): void => {
          // clear the store of the modals
          const exhibitionStore = (globalThis as any)?.store?.createStore({
            name: 'exhibitionScreen',
          });
          const controllerStore = (globalThis as any)?.store?.createStore({
            name: 'controllerScreen',
          });
          exhibitionStore.clear();
          controllerStore.clear();

          setSelectedExhibition({});
          setSelectedController({});
          chooseExhibitionScreen.modal.show();
        }}>Alterar a tela de apresentação</button>
      </div>
      <div id={styles.right}>
        <button className={styles.controlButton} onClick={(): void => {
          if (isPresenting) return stopPresentation(() => { router.push('/home'); });
          router.push('/home');
        }}>Fechar projeto</button>
        <button className={styles.controlButton} onClick={(): void =>
          isPresenting ? stopPresentation() : startPresentation()
        }>{isPresenting ? 'Parar Apresentação' : 'Iníciar apresentação'}</button>
      </div>
    </div>
  </div>;
}
