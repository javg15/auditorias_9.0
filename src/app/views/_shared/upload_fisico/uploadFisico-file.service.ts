import { Injectable } from '@angular/core';
import {ArchivosService} from 'src/app/views/catalogos/archivos/services/archivos.service';
import { shell } from 'electron';
const electron = require('electron');
const fs = require('fs');
let uploadDir = './uploads';

@Injectable({
  providedIn: 'root'
})
export class UploadFisicoFileService {


  constructor(private archivosSvc: ArchivosService) { }

  pushFileToStorage(fileSrc: File,ruta:string): Promise<any> {
    //buscar si existe el registro
    let path = uploadDir + '/' + ruta;
        /*nombre: req.file.originalname,
        datos: req.file.buffer*/

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
   
    fs.copyFile(fileSrc.path, path + '/' + fileSrc.name, (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });
    return null;
  }

  async listFile(id): Promise<any> {
    return await this.archivosSvc.getRecord(id)
  }

  //getFile(id): Observable<any> {
  async getFile(ruta){
    let dir=(electron.app || electron.remote.app).getAppPath()

    //console.log("(antes)dir=>",dir)
    if(dir.indexOf("\\resources\\app")>=0)
      dir=dir.replace("\\resources\\app","")
    //console.log("(desp)dir=>",dir)
    //console.log("dir=>",dir + "/uploads/" + ruta)
    shell.openPath( dir + "/uploads/" + ruta);
  }
}
