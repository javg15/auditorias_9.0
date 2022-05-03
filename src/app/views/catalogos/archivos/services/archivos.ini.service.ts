import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { ArchivosService } from './archivos.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ArchivosIniService {

  constructor(private ds: ArchivosService) { }

  
}
