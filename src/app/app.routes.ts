import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';
import { LearnComponent } from './features/learn/learn';
import { PracticeComponent } from './features/practice/practice';
import { AssessComponent } from './features/assess/assess';
import { ProfileComponent } from './profile/profile';
import { Login } from './login/login';
import { Feedback } from './feedback/feedback';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'assess', component: AssessComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: Login },
  { path: 'feedback', component: Feedback },
  { path: '**', redirectTo: '' }
];
