import { ControllerMaximize } from './ControllerMaximize.js';
import { ControllerMinimize } from './ControllerMinimize.js';
import { SetTitleBarOverlay } from './SetTitleBarOverlay.js';
import { ControllerMove } from './ControllerMove.js';
import { AppStopAnswer } from './AppStopAnswer.js';
import { AppGetScreens } from './AppGetScreens.js';
import { AppOpenDialog } from './AppOpenDialog.js';
import { AppStop } from './AppStop.js';
import { Eval } from './Eval.js';
import { AppGetWindowLayout } from './AppGetWindowLayout.js';

export const events = [
  AppGetWindowLayout,
  ControllerMaximize,
  ControllerMinimize,
  SetTitleBarOverlay,
  ControllerMove,
  AppStopAnswer,
  AppGetScreens,
  AppOpenDialog,
  AppStop,
  Eval,
];
