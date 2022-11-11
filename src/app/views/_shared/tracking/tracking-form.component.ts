import { Component, Input, OnInit, Output, EventEmitter,ViewChild} from '@angular/core';
import { TrackingService } from './tracking.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tracking-form',
  templateUrl: './tracking-form.component.html',
  styleUrls: ['./tracking-form.component.css']
})

export class TrackingFormComponent implements OnInit {
  @Input() nombreTabla: string;
  @Input() idRecord: string;  

  @ViewChild('largeModalHistorial') largeModalHistorial: ModalDirective;

  trackingList: Array<any> = [];

  constructor(private trackingService: TrackingService,) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  async getTracking(): Promise<void> {

    await this.trackingService.getTracking(this.nombreTabla,this.idRecord).then(resp => {
      this.trackingList = resp;
    });
  }

  showTrackingModal(){
    this.getTracking();
    this.largeModalHistorial.show();
  }

   // close modal
  close(): void {
    this.largeModalHistorial.hide();
  }

  JSON_Parse(contenido):Array<any>{
    return JSON.parse(contenido)
  }

}
