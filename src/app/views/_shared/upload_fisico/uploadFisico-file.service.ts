import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../../_services/token-storage.service';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../../../src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadFisicoFileService {

  public API_URL = environment.APIS_URL;

  constructor(private http: HttpClient,private token: TokenStorageService) { }

  pushFileToStorage(file: File,ruta:string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    console.log("file.size=>",file.size);
    formdata.append('file', file);
    formdata.append('ruta',ruta);

    const req = new HttpRequest('POST', this.API_URL + '/archivos/uploadFisico', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);

  }

  listFile(id): Observable<any> {
    return this.http.get(this.API_URL + '/archivos/info/' + id);
  }

  //getFile(id): Observable<any> {
  getFile(ruta){
    const token = this.token.getToken();
    let re = /\//g;//reemplazar diagonal
    ruta=ruta.replace(re, "!");

    this.http.get(this.API_URL + '/archivos/df/' + ruta, {responseType: 'blob'})
    .subscribe( data => {

      //var file = new Blob([data], {type: tipo});
      var fileURL = window.URL.createObjectURL(data);
      window.open(fileURL);
  });

    //return this.http.get(this.API_URL + '/archivos/' + id);
  }
}
