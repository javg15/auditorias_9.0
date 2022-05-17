import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuditoriasreporteService } from '../services/auditoriasreporte.service';

import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-auditoriasreporte-form',
  templateUrl: './auditoriasreporte-form.component.html',
  styleUrls: ['./auditoriasreporte-form.component.css']
})

export class AuditoriasreporteFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción

  /* El decorador @ViewChild recibe la clase DataTableDirective, para luego poder
  crear el dtElement que represente la tabla que estamos creando. */
  API_URL = environment.APIS_URL;


  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModalReporte') basicModalReporte: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;

  record: any;

  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private auditoriasreporteService: AuditoriasreporteService,
    private route: ActivatedRoute
      ) {
      this.elementModal = el.nativeElement;
      
  }

  ngOnInit(): void {

    let modal = this;

    // ensure id attribute exists
    if (!modal.id) {//idModal {
        console.error('modal must have an id');
        return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.auditoriasreporteService.add(modal);


    //loading
    this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.auditoriasreporteService.remove(this.id); //idModal
      this.elementModal.remove();
  }


  // open modal
  async open(idItem: string, accion: string,idParent:number):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Reporte de auditoría - " + titulosModal[accion] + " registro";

    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModalReporte.show();
  }

  // close modal
  close(): void {
      this.basicModalReporte.hide();
  }

  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }


}
