import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { AuditoriasanexosService } from './auditoriasanexos.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuditoriasanexosIniService implements Resolve <Observable<any>>{

  constructor(private ds: AuditoriasanexosService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders()
  }
}
