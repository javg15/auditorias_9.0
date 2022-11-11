import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,Observer,of } from 'rxjs';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import { Usuarios } from 'src/app/_data/_models/usuarios';

import { environment } from '../../../src/environments/environment';
import {Md5} from 'ts-md5';


const AUTH_URL = environment.APIS_URL + '/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private conn:Connection;
  constructor(private dbSvc: DatabaseService,private http: HttpClient) { }

  attemptAuth(credentials): Observable<any> {      
      return new Observable((observer: Observer<any>)=>{  
        setTimeout(() => observer.next(async ()=>{
          console.log("aaaaa")     
          this.conn=await this.dbSvc.connection
           
          const rep = await this.conn.manager.getRepository(Usuarios)
          const usuario=await rep.findOne({    username: credentials.username })
          console.log("usuario=>",usuario)
          return of(usuario)
        }
          ), 1000);
        
          /*this.restService.post('/authenticate', credentials)         
            .finally(observer.complete())         
            .subscribe(           
              data => {             
                observer(data.token);             
                console.log('Observer: ' + data.token );           
              },       
              err => observer.error(err)         
          )     */ 
        })
      }

  async login(credentials): Promise<Observable<any>> {

    this.conn=await this.dbSvc.connection
      
    const rep = await this.conn.manager.getRepository(Usuarios)
    const usuario=await rep.findOne({    
        username: credentials.username
          ,password:Md5.hashStr(credentials.password)
    })
    
    //console.log("md5=>",Md5.hashStr('jaime151'))
    /************** */
    if(usuario)
      return of(usuario).pipe();
    else
      return of(false).pipe();
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }
}
