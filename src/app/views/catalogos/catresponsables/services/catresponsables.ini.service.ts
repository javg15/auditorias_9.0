import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CatresponsablesService } from './catresponsables.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CatresponsablesIniService implements Resolve<Observable<any>>{

  constructor(private ds: CatresponsablesService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}