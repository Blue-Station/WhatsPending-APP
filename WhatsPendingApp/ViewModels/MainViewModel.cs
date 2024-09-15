using System;
using System.Threading.Tasks;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using WhatsPendingApp.Views;

namespace WhatsPendingApp.ViewModels;

public partial class MainViewModel : ViewModelBase {
  [ObservableProperty]
  public Control _content = default!;
  private readonly Router router;

  public MainViewModel(Router router) {
    this.router = router;
    router.OnChange(() => {
      Content = router.currentRoute[^1];
    });
  }

  [RelayCommand]
  private async Task Change() {
    await Task.Delay(1000);
  }
}
