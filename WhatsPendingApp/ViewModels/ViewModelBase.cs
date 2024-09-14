using System;
using System.Threading.Tasks;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using WhatsPendingApp.Views;

namespace WhatsPendingApp.ViewModels;

public abstract partial class ViewModelBase : ObservableObject {
  protected Router router;

  public ViewModelBase(Router appRouter) {
    router = appRouter;
  }
}