import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginService } from './services/login.service';
import * as $ from 'jquery'

@NgModule({
  imports: [
    FormsModule,
    LoginRoutingModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [ LoginComponent,

  ],
    providers: [
      LoginService
    ]
})
export class LoginModule { }
