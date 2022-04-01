import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../../_services/token-storage.service';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../../../src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  public API_URL = environment.APIS_URL;

  constructor(private http: HttpClient,private token: TokenStorageService) { }

  pushFileToStorage(file: File,idFile:number): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('idFile',(idFile==null?"0":idFile.toString()));

    const req = new HttpRequest('POST', this.API_URL + '/archivos/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  listFile(id): Observable<any> {
    return this.http.get(this.API_URL + '/archivos/info/' + id);
  }

  //getFile(id): Observable<any> {
  getFile(id,tipo){
    const token = this.token.getToken();
    let headers: any = {'Authorization': token};
    //let params = new HttpParams().set("id_ze", id_ze);
    /*return this.http.get(this.API_URL + '/archivos/' + id, {
    headers: headers,
    responseType: 'blob' // very important that this is set
    });*/

    this.http.get(this.API_URL + '/archivos/' + id, {responseType: 'arraybuffer'})
    .subscribe( data => {

      var file = new Blob([data], {type: tipo});
      var fileURL = window.URL.createObjectURL(file);
      window.open(fileURL);
  });

    //return this.http.get(this.API_URL + '/archivos/' + id);
  }
}
