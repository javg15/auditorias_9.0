import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CatservidoresService } from '../services/catservidores.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Catservidores } from 'src/app/_data/_models/catservidores';
import { ValidationSummaryComponent } from '../../../_shared/validation/validation-summary.component';
import { actionsButtonSave, titulosModal } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-catservidores-form',
  templateUrl: './catservidores-form.component.html',
  styleUrls: ['./catservidores-form.component.css']
})

export class CatservidoresFormComponent implements OnInit, OnDestroy {
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

  record: Catservidores;
  keywordSearch = 'full_name';
  isLoadingSearch:boolean;

  constructor(private isLoadingService: IsLoadingService,
      private catservidoresService: CatservidoresService, private el: ElementRef,
      ) {
      this.elementModal = el.nativeElement;
  }

  newRecord(): Catservidores {
    return {
      id: 0,nombre: '', departamento: '', puesto:'',state: ''
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
      modal.catservidoresService.add(modal);

      //loading
      this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.catservidoresService.remove(this.id); //idModal
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
      const resp=await this.catservidoresService.setRecord(this.record,this.actionForm);
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
    this.tituloForm="Servidor - " +titulosModal[accion] + " registro";

    if(idItem=="0"){
      this.record =this.newRecord();
    } else {
      this.record=await this.catservidoresService.getRecord(idItem);
      console.log("this.record=>",this.record)
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
