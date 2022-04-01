import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { LoginService } from './login.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginIniService implements Resolve <Observable<any>>{

  constructor(private ds: LoginService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return null;
  }
}
