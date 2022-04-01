import { Component, OnInit, Input } from '@angular/core';
import { UploadFileService } from './upload-file.service';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../../../src/environments/environment';


@Component({
  selector: 'details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.css']
})
export class DetailsUploadComponent implements OnInit {
  public API_URL = environment.APIS_URL;

  @Input() fileUpload: any;

  constructor(private uploadFileSvc:UploadFileService) { }

  ngOnInit() {
  }

  getFile(id,tipo){
    this.uploadFileSvc.getFile(id,tipo);
  }

}

