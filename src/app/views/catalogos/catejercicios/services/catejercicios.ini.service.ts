import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { CatejerciciosService } from './catejercicios.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CatejerciciosIniService implements Resolve<Observable<any>>{

  constructor(private ds: CatejerciciosService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.ds.getHeaders().then(
      take(1),
      map(userdata => userdata)
    )
  }
}