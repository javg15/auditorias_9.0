import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CatentidadesService } from '../services/catentidades.service';
import { CatresponsablesService } from '../../catresponsables/services/catresponsables.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Catentidades } from 'src/app/_data/_models/catentidades';
import { Catresponsables } from 'src/app/_data/_models/catresponsables';
import { ValidationSummaryComponent } from '../../../_shared/validation/validation-summary.component';
import { actionsButtonSave, titulosModal } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-catentidades-form',
  templateUrl: './catentidades-form.component.html',
  styleUrls: ['./catentidades-form.component.css']
})

export class CatentidadesFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Output() redrawEvent = new EventEmitter<any>();
  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;

  record: Catentidades;
  keywordSearch = 'full_name';
  isLoadingSearch:boolean;

  catresponsablesCat: any = [  ];

  constructor(private isLoadingService: IsLoadingService,
      private catentidadesService: CatentidadesService, private el: ElementRef,
      private catresponsablesSvc:CatresponsablesService
      ) {
      this.elementModal = el.nativeElement;
      
  }

  newRecord(): Catentidades {
    return {
      id: 0,nombrecorto: 'CA', nombrelargo: '',domicilio:'',id_catresponsables:0,state: ''
    };
  }
  ngOnInit(): void {

      this.record =this.newRecord();

      let modal = this;

      // ensure id attribute exists
      if (!modal.id) {//idModal {
          console.error('modal must have an id');
          return;
      }
      // add self (this modal instance) to the modal service so it's accessible from controllers
      modal.catentidadesService.add(modal);

      //loading
      this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.catentidadesService.remove(this.id); //idModal
      this.elementModal.remove();
  }

  async submitAction(form) {

    if(this.actionForm.toUpperCase()!=="VER"){

      this.validSummary.resetErrorMessages(form);

      await this.isLoadingService.add(this.setRecord(),{ key: 'loading' });
    }
  }

  async setRecord(){
    {
      const resp=await this.catentidadesService.setRecord(this.record,this.actionForm);
      if (resp.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(resp.message);
      }
      else if(resp.message=="success"){
        if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
        this.record.id=resp.id;
        this.successModal.show();
        setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }
  // open de este form
  async open(idItem: string, accion: string):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Entidad - " +titulosModal[accion] + " registro";

    this.catresponsablesCat=await this.catresponsablesSvc.getCatalogo();

    if(idItem=="0"){
      this.record =this.newRecord();
    } else {
      this.record=await this.catentidadesService.getRecord(idItem);
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
