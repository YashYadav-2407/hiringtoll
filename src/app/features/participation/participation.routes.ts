import { Routes } from '@angular/router';
import { ParticipationHomePageComponent } from './pages/participation-home/participation-home';
import { EventDetailPageComponent } from './pages/event-detail/event-detail';

export const PARTICIPATION_ROUTES: Routes = [
  {
    path: '',
    component: ParticipationHomePageComponent,
  },
  {
    path: ':id',
    component: EventDetailPageComponent,
  },
];
