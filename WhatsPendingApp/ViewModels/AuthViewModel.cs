using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using System.Diagnostics;
using System;
using Avalonia.Controls;

namespace WhatsPendingApp.ViewModels;

public partial class AuthViewModel : ViewModelBase {
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string? _username;
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string? _password;

    [ObservableProperty]
    private string _greeting = "Eu sou a AuthView!";

  [RelayCommand(CanExecute = nameof(CanLogin))]
    private async Task Login() {
      

      using var httpClient = new HttpClient();
      string url = "http://192.168.0.247:3000/user/login";

      var response = await httpClient.PostAsync(url, new StringContent(JsonSerializer.Serialize(new { email = Username, password = Password })));
      if (!response.IsSuccessStatusCode) {
        Greeting = "Erro ao fazer login: " + response.ReasonPhrase;
        Debug.WriteLine("Erro ao fazer login");
        return;
      }
      
      var b = await response.Content.ReadAsStringAsync();

      Debug.WriteLine(b);
    }

    private bool CanLogin() {
      return !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);
    }
}
