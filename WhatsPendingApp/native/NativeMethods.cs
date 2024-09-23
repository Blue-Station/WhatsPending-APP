using System.Runtime.InteropServices;

namespace WhatsPendingApp.native;
public static unsafe partial class NativeMethods {
  [LibraryImport("user32.dll")]
  public static partial int GetSystemMetrics(int nIndex);
}
