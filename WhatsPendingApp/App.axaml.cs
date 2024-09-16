using System;
using System.Collections.Generic;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using WhatsPendingApp.ViewModels;
using WhatsPendingApp.Views;
using WhatsPendingApp.Views.pages;

namespace WhatsPendingApp;

public class Router {
  public List<Control> currentRoute = [];
  public Action onChangeAction = default!;

  public bool SetRoute(Control view) {
    currentRoute.Add(view);
    onChangeAction();
    return true;
  }

  public void Back() {
    currentRoute.RemoveAt(currentRoute.Count - 1);
    onChangeAction();
  }

  public void OnChange(Action update) {
    onChangeAction = update;
  }
}


public partial class App : Application {
  public override void Initialize() {
    AvaloniaXamlLoader.Load(this);
  }

  public readonly Router router = new();

  public override void OnFrameworkInitializationCompleted() {
    if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop) {
      // Line below is needed to remove Avalonia data validation.
      // Without this line you will get duplicate validations from both Avalonia and CT
      BindingPlugins.DataValidators.RemoveAt(0);
      desktop.MainWindow = new MainWindow {
        DataContext = new MainViewModel(router)
      };
    }
    else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform) {
      singleViewPlatform.MainView = new MainView {
        DataContext = new MainViewModel(router)
      };
    }

    router.SetRoute(new AuthView{
      DataContext = new AuthViewModel()
    });

    base.OnFrameworkInitializationCompleted();
  }
}