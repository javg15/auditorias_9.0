import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DeclaracionesService {
  public soloLetrasPatron = { '0': { pattern: new RegExp('\[a-zA-Z\]')} };
}
