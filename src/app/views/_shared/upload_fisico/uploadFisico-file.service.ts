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
    //generar un uuid aleatorio para el nombre de archivo interno, así no se sobreesriben los archivos
    let nombreUuid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
    //buscar si existe el registro
    let path = uploadDir + '/' + ruta;
        /*nombre: req.file.originalname,
        datos: req.file.buffer*/

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
   
    fs.copyFile(fileSrc.path, path + '/' + nombreUuid + '.' + fileSrc.name.split('.').pop(), (err) => {//fileSrc.name
      if (err){ throw err;}
      console.log('source.txt was copied to destination.txt');
      return {"uuid":nombreUuid};
    });
    return Promise.resolve({"uuid":nombreUuid});
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
