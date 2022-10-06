import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PortabilidadService } from '../services/portabilidad.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { actionsButtonSave, titulosModal } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';
const {dialog} = require('electron').remote;

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-portabilidad-form',
  templateUrl: './portabilidad-form.component.html',
  styleUrls: ['./portabilidad-form.component.css']
})

export class PortabilidadFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor

  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;

  pathTarget:string = '';

  constructor(private isLoadingService: IsLoadingService,
      private portabilidadService: PortabilidadService, private el: ElementRef,
      ) {
      this.elementModal = el.nativeElement;
  }

 
  ngOnInit(): void {
      //loading
      this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      
  }

  async selectFolder():  Promise<void> {
    let me=this;
    dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    .then(function (response) {
      if (!response.canceled) {
        // handle fully qualified file name
        me.pathTarget=response.filePaths[0];
      } else {
        me.pathTarget='';
      }
    });
  }

  async execPortabilidad():  Promise<void> {
    
  }
 
}
