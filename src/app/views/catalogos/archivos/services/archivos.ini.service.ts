import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { ArchivosService } from './archivos.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ArchivosIniService implements Resolve <Observable<any>>{

  constructor(private ds: ArchivosService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.ds.getHeaders().pipe(
      take(1),
      map(userdata => userdata)
    )
  }
}
