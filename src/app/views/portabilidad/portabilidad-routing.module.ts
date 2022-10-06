import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortabilidadFormComponent } from './form/portabilidad-form.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Auditorías'
    },
    children: [
      {
        path: '',
        redirectTo: 'form'
      },
      
      {
        path: 'form',
        component: PortabilidadFormComponent,
        data: {
          title: 'Auditorías'
        },
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortabilidadRoutingModule {}
