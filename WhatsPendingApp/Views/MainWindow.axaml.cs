using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using Avalonia.Platform;
using Avalonia.VisualTree;
using WhatsPendingApp.native;
using WhatsPendingApp.ViewModels;

namespace WhatsPendingApp.Views;

public partial class MainWindow : Window {
  public MainWindow() {
    InitializeComponent();
    Opened += OnWindowOpened;
  }

  public static double GetWindowButtonWidth() {
    // Get width of minimize/maximize/close buttons
    int buttonWidth = NativeMethods.GetSystemMetrics(31); // SM_CXSIZE
    return buttonWidth;
  }

  public static double GetNativeButtonWidthEstimate() {
    if (OperatingSystem.IsWindows()) {
        // On Windows, use the GetSystemMetrics for more accuracy
        return GetWindowButtonWidth();
    }
    // Default estimate for other platforms
    return 60; // Assuming 3 buttons with padding
  }

  private FlowDirection GetNativeButtonPosition() {
    return OperatingSystem.IsMacOS() ? FlowDirection.LeftToRight : FlowDirection.RightToLeft;
  }

  private void OnWindowOpened(object? sender, EventArgs e) {
    var clientSize = this.ClientSize;
    var totalSize = this.Bounds.Size;
    
    // Title bar height is the difference
    var titleBarHeight = totalSize.Height - clientSize.Height;
    
    // Pass this value to your ViewModel
    (this.DataContext as MainViewModel)?.SetTitleBarHeight(titleBarHeight);
    (this.DataContext as MainViewModel)?.SetNativeButtonsData(GetNativeButtonWidthEstimate(), GetNativeButtonPosition());
  }
}