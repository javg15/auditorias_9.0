import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { UploadFisicoFileService } from '../uploadFisico-file.service';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'detailstable-uploadFisico',
  templateUrl: './detailstable-uploadFisico.component.html',
  styleUrls: ['./detailstable-uploadFisico.component.css']
})
export class DetailsUploadFisicoComponent implements OnInit {
  public API_URL = environment.APIS_URL;

  @Input() fileUpload: any;

  @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();

  constructor(private uploadFisicoFileSvc:UploadFisicoFileService) { }

  ngOnInit() {
  }

  getFile(ruta){
    this.uploadFisicoFileSvc.getFile(ruta);
  }

  removeFile(id,ruta){
    this.fileUpload=null;
    this.uploadFisicoFileSvc.removeFile(id,ruta);
    this.onRemoved.emit({id:id,ruta:ruta})
  }

  

}

