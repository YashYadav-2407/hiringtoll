import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';
import { LearnComponent } from './features/learn/learn';
import { PracticeComponent } from './features/practice/practice';
import { AssessComponent } from './features/assess/assess';
import { TypingComponent } from './features/typing/typing';
import { ProfileComponent } from './profile/profile';
import { Login } from './login/login';
import { AuthGuard } from './core/guards/auth.guard';
import { AboutComponent } from './pages/about/about';
import { CareersComponent } from './pages/careers/careers';
import { ContactComponent } from './pages/contact/contact';
import { BlogComponent } from './pages/blog/blog';
import { HelpComponent } from './pages/help/help';
import { PrivacyComponent } from './pages/privacy/privacy';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-2', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'learn', component: LearnComponent, canActivate: [AuthGuard] },
  { path: 'practice', component: PracticeComponent, canActivate: [AuthGuard] },
  { path: 'assess', component: AssessComponent, canActivate: [AuthGuard] },
  { path: 'typing', component: TypingComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // Public pages (footer links)
  { path: 'about', component: AboutComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'help', component: HelpComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: 'login' }
];
