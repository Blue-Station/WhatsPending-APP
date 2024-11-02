'use client';

import React, { useEffect, useState } from 'react';
import styles from './controlScreen.module.css';

export default function ControllerScreen({ project }: { project: { name: string, fileRoot: string, scenes: any[] } }): React.ReactElement {
  const [indexing, setIndexing] = useState<boolean>(true);
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const fs = (globalThis as any).fs;
    const ipc = (globalThis as any).ipc;
    const path = (globalThis as any).path;

    const validExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mkv', '.mp4', '.webm', '.ogg', '.mp3', '.wav']);

    const files = fs.readdirSync(project.fileRoot);
    const filteredFiles = files.filter((file: string) => {
      const extension = path.extname(file);
      return validExtensions.has(extension);
    });

    setFileList(filteredFiles);

    // Disparado a cada arquivo que tiver thumbnail gerado
    ipc.on('app.generate.thumbnail.progress', ([file]: string) => {});

    // Recebe a lista de todos os arquivos que tiveram thumbnails gerados
    ipc.once('app.generate.thumbnail.done', ([files]: string[]) => {
      setIndexing(false);
      ipc.removeAllListeners('app.generate.thumbnail.progress');
    });

    ipc.send('app.generate.thumbnail', project.fileRoot);
  }, []);

  return <div id={styles.controlScreen}>
    <div id={styles.leftPanel}>
      <div id={styles.scenesPanel}>
        <h1 className={styles.windowTitle}>Cenas</h1>
      </div>
      <div id={styles.fileExplorer}>
        <h1 className={styles.windowTitle}>Arquivos</h1>
      </div>
    </div>
    <div id={styles.mainRegion}>
      <div id={styles.topRegion}>
        <div id={styles.previewArea}>
          <div id={styles.exhibitionPreview}></div>
          <div id={styles.editorPreview}></div>
        </div>
      </div>
      <div id={styles.timeline}>
        <div id={styles.layers}>
          <h1 className={styles.windowTitle}>Camadas</h1>
        </div>
        <div id={styles.layerConfig}>
          <h1 className={styles.windowTitle}>Configurações da camada</h1>
        </div>
        <div id={styles.controlButtons}>
          <h1 className={styles.windowTitle}>Controles</h1>
        </div>
      </div>
    </div>
  </div>;
}
