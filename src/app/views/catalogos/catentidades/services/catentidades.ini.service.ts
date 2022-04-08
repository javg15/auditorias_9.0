import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CatentidadesService } from './catentidades.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CatentidadesIniService implements Resolve<Observable<any>>{

  constructor(private ds: CatentidadesService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}