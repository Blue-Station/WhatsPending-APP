using CommunityToolkit.Mvvm.ComponentModel;

namespace WhatsPendingApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    [ObservableProperty] private string _greeting = "Come hang out";
}