import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { LearnComponent } from './features/learn/learn';
import { PracticeComponent } from './features/practice/practice';
import { AssessComponent } from './features/assess/assess';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  // HOME
  {
    path: '',
    component: DashboardComponent
  },

  // PAGES
  { path: 'learn', component: LearnComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'assess', component: AssessComponent },
  { path: 'profile', component: ProfileComponent },

  // FALLBACK
  { path: '**', redirectTo: '' }
];
