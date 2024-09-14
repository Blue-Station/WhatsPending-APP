using System;
using System.Threading.Tasks;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using WhatsPendingApp.Views;

namespace WhatsPendingApp.ViewModels;

public partial class AboutViewModel : ViewModelBase {
  public AboutViewModel(Router router) : base(router) {}

  [RelayCommand]
  private async Task ChangeBack() {
    await Task.Delay(1000);
    router.back();
  }
}
