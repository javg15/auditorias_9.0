import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CatservidoresService } from './catservidores.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CatservidoresIniService implements Resolve<Observable<any>>{

  constructor(private ds: CatservidoresService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}