import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { HomeService } from './home.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HomeIniService implements Resolve <Observable<any>>{

  constructor(private ds: HomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return null;
  }
}
