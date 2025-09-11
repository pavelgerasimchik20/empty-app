import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { TodoListComponent } from './pages/todo/todo.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  { path: 'todo', component: TodoListComponent, canActivate: [authGuard] },
  { path: 'users', component: UserlistComponent, canActivate: [authGuard] },
  { path: 'map', component: MapComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
