import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter  } from '@angular/core';
import { DataTablesResponse } from '../../../../classes/data-tables-response';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditoriasdetalle, Cattipohorasdocente,Catquincena,Semestre } from '../../../../_models';
import { CattipohorasdocenteService } from '../../../catalogos/cattipohorasdocente/services/cattipohorasdocente.service';
import { SemestreService } from '../../../catalogos/semestre/services/semestre.service';
import { CatquincenaService } from '../../../catalogos/catquincena/services/catquincena.service';

import { ValidationSummaryComponent } from '../../../_shared/validation/validation-summary.component';
import { actionsButtonSave, titulosModal } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';

import { AuditoriasdetalleService } from '../services/auditoriasdetalle.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-auditoriasdetalle-form',
  templateUrl: './auditoriasdetalle-form.component.html',
  styleUrls: ['./auditoriasdetalle-form.component.css']
})

export class AuditoriasdetalleFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Output() redrawEvent = new EventEmitter<any>();

  /* El decorador @ViewChild recibe la clase DataTableDirective, para luego poder
  crear el dtElement que represente la tabla que estamos creando. */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtTrigger: Subject<DataTableDirective> = new Subject();


  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;

  record: Auditoriasdetalle;
  cattipohorasdocenteCat:Cattipohorasdocente[];
  semestreCat:Semestre[];
  catquincenaCat:Catquincena[];


  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private CattipohorasdocenteSvc: CattipohorasdocenteService,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private semestreSvc: SemestreService,
    private catquincenaSvc: CatquincenaService,

      ) {
      this.elementModal = el.nativeElement;
      this.CattipohorasdocenteSvc.getCatalogo().subscribe(resp => {
        this.cattipohorasdocenteCat = resp;
      });
      this.semestreSvc.getCatalogo().subscribe(resp => {
        this.semestreCat = resp;
      });
      this.catquincenaSvc.getCatalogo().subscribe(resp => {
        this.catquincenaCat = resp;
      });
  }

  newRecord(idParent:number): Auditoriasdetalle {
    return {
      id: 0,  id_auditorias:idParent, id_cattipohorasdocente:0, fecha_ini:null, fecha_fin:null,id_categorias:0,
      id_semestre_ini:0,id_catquincena_ini:0,id_catquincena_fin:0,
      state: '', created_at: new Date(),  updated_at: new Date(), id_usuarios_r: 0
    };
  }
  ngOnInit(): void {

      this.record =this.newRecord(0);

      let modal = this;

      // ensure id attribute exists
      if (!modal.id) {//idModal {
          console.error('modal must have an id');
          return;
      }
      // add self (this modal instance) to the modal service so it's accessible from controllers
      modal.auditoriasdetalleService.add(modal);

      //loading
      this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.auditoriasdetalleService.remove(this.id); //idModal
      this.elementModal.remove();
  }


  async submitAction(form) {

    if(this.actionForm.toUpperCase()!=="VER"){
      this.validSummary.resetErrorMessages(form);

      await this.isLoadingService.add(
      this.auditoriasdetalleService.setRecord(this.record,this.actionForm).subscribe(resp => {
        if (resp.hasOwnProperty('error')) {
          this.validSummary.generateErrorMessagesFromServer(resp.message);
        }
        else if(resp.message=="success"){
          if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
          this.record.id=resp.id;
          this.successModal.show();
          setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
        }
      }),{ key: 'loading' });
    }
  }


  // open modal
  open(idItem: string, accion: string,idParent:number):  void {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Detalle de horas - " + titulosModal[accion] + " registro";

    if(idItem=="0"){
      this.record =this.newRecord(idParent);
    } else {
    this.auditoriasdetalleService.getRecord(idItem).subscribe(resp => {
      this.record = resp;
    });
  }

    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModal.show();
  }

  // close modal
  close(): void {
      this.basicModal.hide();
      if(this.actionForm.toUpperCase()!="VER"){
        this.redrawEvent.emit(null);
      }
  }

  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }



}
