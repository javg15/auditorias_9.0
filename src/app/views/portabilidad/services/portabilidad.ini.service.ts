import { Injectable } from '@angular/core';


import { PortabilidadService } from './portabilidad.service';

@Injectable({
  providedIn: 'root'
})
export class PortabilidadIniService {

  constructor(private ds: PortabilidadService) { }

  
}