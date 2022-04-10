import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { AuditoriasService } from './auditorias.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuditoriasIniService implements Resolve <Observable<any>>{

  constructor(private ds: AuditoriasService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}
