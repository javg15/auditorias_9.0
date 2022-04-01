import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  public API_URL = environment.APIS_URL;

  constructor(private http: HttpClient) { }

  getSearchcampos(nombreModulo: string): Observable<any> {
    return this.http.post(this.API_URL + '/shared/getSearchcampos', {
      nombreModulo: nombreModulo
    }, httpOptions);
  }

  getSearchoperadores(id_campo: number): Observable<any> {
    return this.http.post(this.API_URL + '/shared/getSearchoperadores', {
      id_campo: id_campo
    }, httpOptions);
  }
}
