import { Injectable } from '@angular/core';
import {ArchivosService} from 'src/app/views/catalogos/archivos/services/archivos.service';
import { shell } from 'electron';

const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

const fs = require('fs');
let uploadDir = './uploads';

@Injectable({
  providedIn: 'root'
})
export class UploadFisicoFileService {


  constructor(private archivosSvc: ArchivosService) { }

  pushFileToStorage(fileSrc: File,ruta:string): Promise<any> {
    const formdata: FormData = new FormData();
    console.log("file.size=>",fileSrc.size);
    formdata.append('file', fileSrc);
    formdata.append('ruta',ruta);

    let file=upload.single("file")

    //buscar si existe el registro
    let path = uploadDir + '/' + ruta;
    console.log("ruta=>", path)
        /*nombre: req.file.originalname,
        datos: req.file.buffer*/

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    file.originalname = file.originalname.replace(/%20/g, ' '); //reemplaza espacios
    // open the file in writing mode, adding a callback function where we do the actual writing
    fs.open(path + '/' + file.originalname, 'w', function(err, fd) {
        if (err) {
            throw 'could not open file: ' + err;
        }

        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(fd, file.buffer, 0, file.buffer.length, null, function(err) {
            if (err) return({ message: err.message });
            fs.close(fd, function() {
                console.log('wrote the file successfully');
                return({ message: "success", ruta: path, nombrearchivo: file.originalname, tipo: file.mimetype });
            });
        });
    });
    return null;
  }

  async listFile(id): Promise<any> {
    return await this.archivosSvc.getRecord(id)
  }

  //getFile(id): Observable<any> {
  async getFile(ruta){
    let re = /\//g;//reemplazar diagonal
    ruta=ruta.replace(re, "!");

    console.log("ruta=>", ruta)
    shell.openPath(ruta);
  }
}
