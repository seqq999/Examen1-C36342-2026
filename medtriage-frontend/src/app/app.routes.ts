import { Routes } from '@angular/router';

import { CitaListComponent } from './cita-list-component/cita-list-component';
import { CitaFormComponent } from './cita-form-component/cita-form-component';

export const routes: Routes = [
  {
    path: 'citas',
    component: CitaListComponent
  },
  {
    path: 'nueva-cita',
    component: CitaFormComponent
  },
  {
    path: '',
    redirectTo: 'citas',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'citas'
  }
];
