using CommunityToolkit.Mvvm.ComponentModel;

namespace WhatsPendingApp.ViewModels;

public partial class MainViewModel : ViewModelBase {
    public MainViewModel() {
        CurrentPage = _pages[0];
    }

    private readonly ViewModelBase[] _pages = [
        new AuthViewModel()
    ];
    
    [ObservableProperty]
    private ViewModelBase _currentPage;
}
