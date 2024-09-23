using System;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Media;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using WhatsPendingApp.Views;

namespace WhatsPendingApp.ViewModels;

public partial class MainViewModel : ViewModelBase {
    private readonly Router router;
    [ObservableProperty] private Control _content = default!;
    [ObservableProperty] private double _decorationGap = 10;
    [ObservableProperty] private double _systemUIWidth = 10;
    [ObservableProperty] private FlowDirection _systemUIDirection = FlowDirection.LeftToRight;
    [ObservableProperty] private IBrush _decorationColorDebug = Brushes.Red;

    public MainViewModel(Router router) {
        this.router = router;
        router.OnChange(() => {
            Content = router.currentRoute[^1];
        });
    }

    public void SetTitleBarHeight(double height) {
      DecorationGap = height > 0 ? height : 32;
      DecorationColorDebug = height > 0 ? Brushes.Blue : Brushes.Purple;
    }

  internal void SetNativeButtonsData(double width, FlowDirection side) {
    SystemUIWidth = width;
    SystemUIDirection = side;
  }

  [RelayCommand]
    private async Task Change() {
        await Task.Delay(1000);
    }
}