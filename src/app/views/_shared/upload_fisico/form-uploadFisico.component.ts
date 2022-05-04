import { Component, OnInit, Output, EventEmitter,Input, ViewChild, ElementRef } from '@angular/core';
import { UploadFisicoFileService } from './uploadFisico-file.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'form-uploadFisico',
  templateUrl: './form-uploadFisico.component.html',
  styleUrls: ['./form-uploadFisico.component.css']
})
export class FormUploadFisicoComponent implements OnInit {
  id:number=0;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  @Input() ruta:any;

  @Output() onLoaded: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private uploadFisicoService: UploadFisicoFileService) { }

  ngOnInit() {
    this.selectedFiles = undefined;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  async upload() {

    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    let event=await this.uploadFisicoService.pushFileToStorage(this.currentFileUpload,this.ruta)
    //console.log("event=>",event)
    if (event.type === HttpEventType.UploadProgress) {
      this.progress.percentage = Math.round(100 * event.loaded / event.total);
      if(this.progress.percentage>99)
      this.progress.percentage=99;
    } else if (event instanceof HttpResponse) {
      //console.log("event=>",event);
      this.onLoaded.emit(JSON.parse(event.body.toString()));
      this.progress.percentage=100;
    }
    

    this.selectedFiles = undefined;
  }

  resetFile() {
    this.fileInput.nativeElement.value="";
  }

  hideFile() {
    this.fileInput.nativeElement.style.display="none";
  }

  showFile() {
    this.fileInput.nativeElement.style.display="";
  }
}
