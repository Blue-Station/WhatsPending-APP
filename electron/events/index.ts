import { ControllerMaximize } from './ControllerMaximize.js';
import { ControllerMinimize } from './ControllerMinimize.js';
import { ControllerMove } from './ControllerMove.js';
import { AppStopAnswer } from './AppStopAnswer.js';
import { AppGetScreens } from './AppGetScreens.js';
import { AppOpenDialog } from './AppOpenDialog.js';
import { AppStop } from './AppStop.js';

export const events = [
  ControllerMaximize,
  ControllerMinimize,
  ControllerMove,
  AppStopAnswer,
  AppGetScreens,
  AppOpenDialog,
  AppStop,
];
