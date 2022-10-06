import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CatestatusService } from './catestatus.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CatestatusIniService implements Resolve<Observable<any>>{

  constructor(private ds: CatestatusService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}