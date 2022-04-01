import { Component, OnInit, Output, EventEmitter,Input, ViewChild, ElementRef } from '@angular/core';
import { UploadFileService } from './upload-file.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {
  id:number=0;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  @Input() actionForm:string;
  @Input() idFile:number;
  @Output() onLoaded: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private uploadService: UploadFileService) { }

  ngOnInit() {
    this.selectedFiles = undefined;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {

    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload,this.idFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if(this.progress.percentage>99)
        this.progress.percentage=99;
      } else if (event instanceof HttpResponse) {
        this.id=JSON.parse(event.body.toString()).id;
        //console.log(event);
        this.onLoaded.emit(this.id);
        this.progress.percentage=100;
      }
    });

    this.selectedFiles = undefined;
  }

  resetFile() {
    this.fileInput.nativeElement.value="";
  }

}
