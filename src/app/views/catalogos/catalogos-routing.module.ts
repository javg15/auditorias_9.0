import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CatejerciciosAdminComponent } from './catejercicios/admin/catejercicios-admin.component';
import { CatejerciciosIniService } from './catejercicios/services/catejercicios.ini.service';


const routes: Routes = [
  {
    path: 'ejercicios',
    component: CatejerciciosAdminComponent,
    resolve: {
      
    }
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogosRoutingModule { }
