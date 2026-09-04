import { Routes } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: PageWrapperComponent,
    children: [],
  },
];
