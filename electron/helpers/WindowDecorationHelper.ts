import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { EDesktopEnvironment, IWindowButtons, EWindowFrameButtons, EKDEButtonsMap, EXFCEButtonsMap, IWindowFrameSettings } from '../../common/interfaces/ISystemDecorations.js';

function getDesktopEnvironment(): EDesktopEnvironment {
  if (process.platform === 'win32') return EDesktopEnvironment.WINDOWS;
  if (process.platform === 'darwin') return EDesktopEnvironment.MACOS;

  const environment = process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || process.env.GDMSESSION || 'unknown';
  switch (environment.toLowerCase()) {
    case 'gnome': {
      return EDesktopEnvironment.GNOME;
    }
    case 'kde':
    case 'plasma': {
      return EDesktopEnvironment.PLASMA;
    }
    case 'xfce': {
      return EDesktopEnvironment.XFCE;
    }
    default: {
      return EDesktopEnvironment.UNKNOWN;
    }
  }
}

async function getWindowsButtonLayout(): Promise<IWindowButtons> {
  return new Promise((resolve) => {
    return resolve({
      leftButtons: [],
      rightButtons: [EWindowFrameButtons.MINIMIZE, EWindowFrameButtons.MAXIMIZE, EWindowFrameButtons.CLOSE],
    });
  });
}

async function getMacOSButtonLayout(): Promise<IWindowButtons> {
  return new Promise((resolve) => {
    return resolve({
      leftButtons: [EWindowFrameButtons.CLOSE, EWindowFrameButtons.MINIMIZE, EWindowFrameButtons.MAXIMIZE],
      rightButtons: [],
    });
  });
}

async function getGNOMEButtonLayout(): Promise<IWindowButtons> {
  return new Promise((resolve, reject) => {
    exec('gsettings get org.gnome.desktop.wm.preferences button-layout', (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      
      const result: IWindowButtons = {
        leftButtons: [],
        rightButtons: [],
      };
      for (const [sideIndex, side] of stdout.replaceAll(/'/gi, '').split(':').entries()) {
        const resultButtons = sideIndex === 0 ? result.leftButtons : result.rightButtons;
        const buttons = side.split(',');

        for (const button of buttons) {
          console.log(button);
          if (button === 'close') resultButtons.push(EWindowFrameButtons.CLOSE);
          if (button === 'minimize') resultButtons.push(EWindowFrameButtons.MINIMIZE);
          if (button === 'maximize') resultButtons.push(EWindowFrameButtons.MAXIMIZE);
        }
      }
      return resolve(result);
    });
  });
}

async function getKDEButtonLayout(): Promise<IWindowButtons> {
  return new Promise((resolve, reject) => {
    const configPath = path.join(process.env.HOME, '.config', 'kwinrc');
    if (!fs.existsSync(configPath)) {
      return reject('Couldn\'t read decoration settings');
    }

    const fileContent = fs.readFileSync(configPath, 'utf8');
    const kdecoration2SectionIndex = Math.max(0, fileContent.indexOf('[org.kde.kdecoration2]'));
    const lines = fileContent.slice(kdecoration2SectionIndex, fileContent.indexOf('[', kdecoration2SectionIndex + 1)).split(/\r?\n/);

    const result: IWindowButtons = {
      leftButtons: [],
      rightButtons: [],
    };

    for (const line of lines) {
      if (line.startsWith('ButtonsOnLeft=') || line.startsWith('ButtonsOnRight=')) {
        for (const button of line.split('=')[1].trim()) {
          if (typeof(EKDEButtonsMap[button]) === 'number') 
            (line.startsWith('ButtonsOnLeft=') ? result.leftButtons : result.rightButtons).push(EKDEButtonsMap[button]);
        }
      }
    }

    return resolve(result);
  });
}

async function getXFCEButtonLayout(): Promise<IWindowButtons> {
  return new Promise((resolve, reject) => {
    exec('xfconf-query -c xfwm4 -p /general/button_layout', (error, stdout) => {
      if (error) {
        return reject('Couldn\'t get window decorations');
      }
  
      const result: IWindowButtons = {
        leftButtons: [],
        rightButtons: [],
      };
      const layout = stdout.trim();
      for (const [sideIndex, side] of layout.split('|').entries()) {
        for (const button of side) {
          if (typeof (EXFCEButtonsMap[button]) === 'number')
            (sideIndex === 0 ? result.leftButtons : result.rightButtons).push(EXFCEButtonsMap[button]);
        }
      }

      return resolve(result);
    });
  });
}

export async function getWindowSettings(): Promise<IWindowFrameSettings> {
  const results = {
    hasFrame: true,
    canUseCustomFrame: false,
    buttons: {
      leftButtons: [],
      rightButtons: [],
    },
  };

  const desktopEnvironment = getDesktopEnvironment();
  if (desktopEnvironment === EDesktopEnvironment.UNKNOWN) return results;
  
  results.canUseCustomFrame = true;
  const getButtonsPerDE = {
    [EDesktopEnvironment.WINDOWS]: getWindowsButtonLayout,
    [EDesktopEnvironment.MACOS]: getMacOSButtonLayout,
    [EDesktopEnvironment.GNOME]: getGNOMEButtonLayout,
    [EDesktopEnvironment.PLASMA]: getKDEButtonLayout,
    [EDesktopEnvironment.XFCE]: getXFCEButtonLayout,
  };
  await getButtonsPerDE[desktopEnvironment]()
    .then((value) => {
      results.buttons = value;
    })
    .catch((error) => {
      console.error(error);
      results.canUseCustomFrame = false;
      return results;
    });
  if (results.buttons.leftButtons.length === 0 && results.buttons.rightButtons.length === 0) results.hasFrame = false;
  return results;
}

