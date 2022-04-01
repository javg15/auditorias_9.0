import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})

export class HeaderAdminComponent implements OnInit {
  @Input() nombreModulo: string;
  @Input() tituloBotonReporte: string="";
  @Input() tituloBotonAdicional: string="";
  @Input() tituloBotonAgregar: string="Agregar";
  @Input() loadingActualizar: boolean=false;

  @Output() agregarEvent = new EventEmitter<any>();
  @Output() reporteEvent = new EventEmitter<any>();
  @Output() adicionalEvent = new EventEmitter<any>();

  itemsStates: Array<any> = [{id: 0, idesc: '', orden: 0}];
  selectedState: string;

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  onClickAgregar() {
    this.agregarEvent.emit();
  }

  onClickReporte() {
    this.reporteEvent.emit();
  }

  onClickAdicional() {
    this.adicionalEvent.emit();
  }

  onSelectState(id_campo) {

  }
}
