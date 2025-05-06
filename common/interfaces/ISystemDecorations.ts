export enum EDesktopEnvironment {
  MACOS,
  WINDOWS,
  GNOME,
  PLASMA,
  XFCE,
  UNKNOWN,
}

export enum EWindowFrameButtons {
  CLOSE,
  MINIMIZE,
  MAXIMIZE,
  // Linux specific \/
  RENDER_ONLY_TITLE_BAR, // Shade
  MENU_DEFAULT, // Draws hamburger menu icon
  MENU_APP, // Renders app icon
  // We don't support kde help button
  PIN_TO_ALL_DESKTOPS, // Also known as sticky
  ALWAYS_ON_TOP,
  ALWAYS_ON_BOTTOM,
  FULLSCREEN // not used
}

export enum EKDEButtonsMap {
  M = EWindowFrameButtons.MENU_DEFAULT,
  N = EWindowFrameButtons.MENU_APP,
  S = EWindowFrameButtons.PIN_TO_ALL_DESKTOPS,
  // H = HELP BUTTON IGNORED,
  I = EWindowFrameButtons.MINIMIZE,
  A = EWindowFrameButtons.MAXIMIZE,
  X = EWindowFrameButtons.CLOSE,
  F = EWindowFrameButtons.ALWAYS_ON_TOP,
  B = EWindowFrameButtons.ALWAYS_ON_BOTTOM,
  L = EWindowFrameButtons.RENDER_ONLY_TITLE_BAR,
  // _ = SPACER (IGNORED for our purposes),
}

export enum EXFCEButtonsMap {
  O = EWindowFrameButtons.MENU_APP,
  T = EWindowFrameButtons.PIN_TO_ALL_DESKTOPS,
  H = EWindowFrameButtons.MINIMIZE,
  S = EWindowFrameButtons.RENDER_ONLY_TITLE_BAR,
  M = EWindowFrameButtons.MAXIMIZE,
  C = EWindowFrameButtons.CLOSE,
  // | = Window Title (Ignored for our purposes)
}

export interface IWindowButtons {
  leftButtons: EWindowFrameButtons[],
  rightButtons: EWindowFrameButtons[],
}

export interface IWindowFrameSettings {
  hasFrame: boolean,
  canUseCustomFrame: boolean,
  buttons: IWindowButtons,
}
