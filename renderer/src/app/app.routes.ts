import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  }, {
  path: '',
  component: ChatComponent,
}];
