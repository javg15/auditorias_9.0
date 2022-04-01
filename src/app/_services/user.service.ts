import { Injectable } from '@angular/core';
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

export class UserService {

  public API_URL = environment.APIS_URL;

  constructor(private http: HttpClient) { }

  /* El siguiente método lee los datos de un registro seleccionado para edición. */
  public getMenu(id: any): Observable<any> {
    return this.http.post(this.API_URL + '/user/getMenu',
      { id }
      , httpOptions);
  }

/*
  getPublicContent(): Observable<any> {
    return this.http.get(this.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.API_URL + 'admin', { responseType: 'text' });
  }*/
}
