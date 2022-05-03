import { Component, OnInit,Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFisicoFileService } from './uploadFisico-file.service';

@Component({
  selector: 'list-uploadFisico',
  templateUrl: './list-uploadFisico.component.html',
  styleUrls: ['./list-uploadFisico.component.css']
})
export class ListUploadFisicoComponent implements OnInit {

  showFile = false;
  fileUploads: string[];

  constructor(private uploadFisicoService: UploadFisicoFileService) { }

  ngOnInit() {
    this.showFiles(0);
  }

  async showFiles(id_archivos:number) {//enable: boolean

    if(id_archivos>0){
      this.fileUploads = await this.uploadFisicoService.listFile(id_archivos);
    }
    else
      this.fileUploads=null;
  }
}
