namespace WhatsPendingApp.Views.components;

using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;

public partial class TopBar : ContentControl {
  public static readonly StyledProperty<double> SystemUIWidthProperty = AvaloniaProperty.Register<TopBar, double>(nameof(SystemUIWidth));
  public static readonly StyledProperty<FlowDirection> SystemUIDirectionProperty = AvaloniaProperty.Register<TopBar, FlowDirection>(nameof(SystemUIDirection)); 

  public double SystemUIWidth {
    get => GetValue(SystemUIWidthProperty);
    set => SetValue(SystemUIWidthProperty, value);
  }

  public FlowDirection SystemUIDirection {
    get => GetValue(SystemUIDirectionProperty);
    set => SetValue(SystemUIDirectionProperty, value);
  }

  public TopBar() {
    InitializeComponent();
  }
}
