using System;
using System.Collections.Generic;
using System.Linq;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using WhatsPendingApp.ViewModels;
using WhatsPendingApp.Views;

namespace WhatsPendingApp;

public class Router {
  public List<Control> currentRoute = new();
  public Action onChangeAction = default!;

  public bool setRoute(Control view) {
    currentRoute.Add(view);
    onChangeAction();
    return true;
  }

  public void back() {
    currentRoute.RemoveAt(currentRoute.Count - 1);
    onChangeAction();
  }

  public void onChange(Action update) {
    onChangeAction = update;
  }
}


public partial class App : Application {
  public override void Initialize() {
    AvaloniaXamlLoader.Load(this);
  }

  private readonly Router router = new();

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

    router.setRoute(new AuthView{
      DataContext = new AuthViewModel(router)
    });

    base.OnFrameworkInitializationCompleted();
  }
}