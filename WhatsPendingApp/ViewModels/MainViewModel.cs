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

  public MainViewModel(Router router) : base(router) {
    router.onChange(() => {
      Content = router.currentRoute[^1];
    });
  }

  [RelayCommand]
  private async Task Change() {
    await Task.Delay(1000);
    router.setRoute(new AboutView{
      DataContext = new AboutViewModel(router)
    });
  }
}
