import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CattiposauditoriaService } from './cattiposauditoria.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CattiposauditoriaIniService implements Resolve<Observable<any>>{

  constructor(private ds: CattiposauditoriaService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}