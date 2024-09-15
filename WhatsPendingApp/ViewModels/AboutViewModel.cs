using System;
using System.Threading.Tasks;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using WhatsPendingApp.Views;

namespace WhatsPendingApp.ViewModels;

public partial class AboutViewModel(Router router) : ViewModelBase {
  [RelayCommand]
  private async Task ChangeBack() {
    await Task.Delay(1000);
    router.Back();
  }
}
