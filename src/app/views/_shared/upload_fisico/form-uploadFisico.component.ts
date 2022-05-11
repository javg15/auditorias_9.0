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
  
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  @Input() ruta:any;
  @Input() selectedFiles: FileList;

  @Output() onLoaded: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('labelInput') labelInput: ElementRef;
  @ViewChild('nameFile') nameFile: ElementRef;
  constructor(private uploadFisicoService: UploadFisicoFileService) { }

  ngOnInit() {
    this.selectedFiles = undefined;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.nameFile.nativeElement.innerHTML=this.selectedFiles[0].name;
    this.nameFile.nativeElement.style.display="";
  }

  async upload() {

    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    let event=await this.uploadFisicoService.pushFileToStorage(this.currentFileUpload,this.ruta)
    //console.log("event=>",event);
    this.onLoaded.emit({ruta:this.ruta,nombre:this.currentFileUpload.name,tipo:this.currentFileUpload.type});
    this.progress.percentage=100;
    

    this.selectedFiles = undefined;
  }

  resetFile() {
    this.fileInput.nativeElement.value="";
    this.showFile();
  }

  hideFile() {
    //this.fileInput.nativeElement.style.display="none";
    this.labelInput.nativeElement.style.display="none";
    this.nameFile.nativeElement.style.display="none";
  }

  showFile() {
    //this.fileInput.nativeElement.style.display="";
    this.labelInput.nativeElement.style.display="";
    this.nameFile.nativeElement.style.display="none";
  }
}
