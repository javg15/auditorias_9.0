import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuditoriasService } from '../services/auditorias.service';
import { AuditoriasreporteService } from '../services/auditoriasreporte.service';
import { Auditoriasreporte} from '../../../_data/_models/auditoriasreporte';
import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js'


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
  @ViewChild('content', {static: false}) pdfTable: ElementRef;

  record: Auditoriasreporte;
  record_detalles:any;
  record_anexos:any;

  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private auditoriasService: AuditoriasService,
    private auditoriasreporteService: AuditoriasreporteService,
    private route: ActivatedRoute
      ) {
      this.elementModal = el.nativeElement;
      
  }

  newRecord(): Auditoriasreporte {
    return {
      id: 0, nombre:'',desc_catentidades: '', desc_catservidores: '', numerooficio: '', 
      id_catejercicios: '', fecha: '', periodoini: '', periodofin: '', desc_cattiposauditoria: '',
      marcolegal: '', desc_catresponsables:'',rubros: '',    numeroauditoria: '',    
      objetivo: '', Detalle:'',Anexo:''
    };
  }

  ngOnInit(): void {

    let modal = this;

    this.record = this.newRecord();

    // ensure id attribute exists
    if (!modal.id) {//idModal {
        console.error('modal must have an id');
        return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.auditoriasService.add(modal);


    //loading
    this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.auditoriasService.remove(this.id); //idModal
      this.elementModal.remove();
  }


  makePDF()
  {
      let doc = new jsPDF('p', 'pt', 'a4');
      let specialElementHandlers = {
 
      };
    
      doc.fromHTML(document.getElementById('pdfTable'), 15, 15, {
          'width': 250,
          'margin': 1,
          'pagesplit': true,
          'elementHandlers': specialElementHandlers
      });

      doc.save('sample-file.pdf');
  }
  async MakePDF() {
    this.userFormIsPending=new Observable<boolean>( observer => { observer.next(true);})
    setTimeout(async ()=>{ 
      await this.makeMultiPage();
      this.userFormIsPending=new Observable<boolean>( observer => { observer.next(false);})
   }, 500)
    
  }

  async makeMultiPage(){
      var element = document.getElementById('pdfTable');
      var opt = {
        margin:       0.5,
        filename:     `auditorias_${new Date().toISOString()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
      };

      // New Promise-based usage:
      html2pdf().set(opt).from(element).save();

      // Old monolithic-style usage:
      //html2pdf(element, opt);
    }

    findItem(valor):any{
      const all = this.record_anexos.filter((obj) => {
        return obj.id_auditoriasdetalle === valor;
      });

      return all;
    }

    print(){
      let element = document.getElementById('ngForm');
      const winHtml = `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Imprimir</title>
                    <style>
                      body{
                        font-family:'Arial';
                      }
                      .table {
                        display: table;         
                        width: auto;         
                        border-spacing: 5px; /* cellspacing:poor IE support for  this */
                      }
                      .tr {
                        display: table-row;
                        width: auto;
                        clear: both;
                      }
                      .td,.th {
                        float: left; /* fix for  buggy browsers */
                        display: table-column;         
                            
                      }
                    
                    .tablaInfo{
                        margin-top: 0px;
                    }
                    .tablaInfo,
                    .tablaInfoSub,
                    .tablaInfoSubSub {
                        border-spacing: 10px;
                        border-collapse: separate;
                        font-size: 10px;
                    }
                    
                    .tablaInfo .titulo {
                        border-spacing: 0px;
                        border-collapse: separate;
                    }
                    .tablaInfo .titulo .td {
                        text-align: center;
                        width: inherit;
                    }
                    
                    .tablaInfo,
                    .tablaInfoSub,
                    .tablaInfo .tr,
                    .tablaInfo .td,
                    .tablaInfoSub .tr,
                    .tablaInfoSub .td,
                    .tablaInfoSubSub .tr,
                    .tablaInfoSubSub .td {
                        border: none;
                        background-color: rgb(255, 255, 255);
                        color: #000;
                    }
                    
                    .tablaInfo .td,
                    .tablaInfoSub .td {
                       
                        padding: 2px;
                    }
                    
                    .tablaInfo .tr .td:nth-child(odd) {
                        font-weight: bold;
                        width:15%;
                    }
                    
                    .tablaInfo .tr .td:nth-child(even){
                        width:30%;
                    }
                    
                    .tablaInfoSub .tr .th:nth-child(1),.tablaInfoSub .tr .th:nth-child(2),
                    .tablaInfoSub .tr .th:nth-child(3),.tablaInfoSub .tr .th:nth-child(4),
                    .tablaInfoSub .tr .th:nth-child(5)
                    {
                        font-weight: bold !important;
                    }
                    .tablaInfoSub .tr .td:nth-child(1),.tablaInfoSub .td .th:nth-child(2),
                    .tablaInfoSub .tr .td:nth-child(3),.tablaInfoSub .td .th:nth-child(4),
                    .tablaInfoSub .tr .td:nth-child(5)
                    {
                        font-weight: normal !important;
                    }
                    
                    .tablaInfoSub .tr .td:nth-child(1),.tablaInfoSub .tr .th:nth-child(1){
                        width:10% !important;
                    }
                    .tablaInfoSub .tr .td:nth-child(2),.tablaInfoSub .tr .th:nth-child(2){
                        width:25% !important;
                    }
                    
                    .tablaInfoSub .tr .td:nth-child(3),.tablaInfoSub .tr .th:nth-child(3),
                    .tablaInfoSub .tr .td:nth-child(4),.tablaInfoSub .tr .th:nth-child(4),
                    .tablaInfoSub .tr .td:nth-child(5),.tablaInfoSub .tr .th:nth-child(5){
                        width:20% !important;
                    }
                    
                    
                    .tablaInfoSubSub .tr .td:nth-child(1),.tablaInfoSubSub .tr .th:nth-child(1) {
                        width:15% !important;
                    }
                    .tablaInfoSubSub .tr .td:nth-child(2),.tablaInfoSubSub .tr .th:nth-child(2) {
                        width:70% !important;
                    }
                    
                    .td.colspan4,.td.colspan4 .tr,.td.colspan4 .tr .td,.td.colspan4 .tr .th,
                    .td.colspan5,.td.colspan5 .tr,.td.colspan5 .tr .td,.td.colspan5 .tr .th{
                        width:95% !important;
                    }
                    </style>
                </head>
                <body onload="window.print()">`+
                    element.getElementsByTagName('div')[0].innerHTML +`
                </body>
            </html>`;

          const winUrl = URL.createObjectURL(
              new Blob([winHtml], { type: "text/html" })
          );

          const win = window.open(
              winUrl,
              "win",
              `width=800,height=400,screenX=200,screenY=200`
          );

    }

  // open modal
  async open(idItem: string, accion: string,idParent:number):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Reporte de auditoría";

    this.record=(await this.auditoriasreporteService.getAdmin(idItem))[0];
    //.replace(/\s+/g, ' ') reemplaza los retornos de carro dentro de los campos
    if(this.record.Detalle)
      this.record_detalles=JSON.parse("[" + this.record.Detalle.replace(/\s+/g, ' ') + "]")
    if(this.record.Anexo)
      this.record_anexos=JSON.parse("[" + this.record.Anexo.replace(/\s+/g, ' ') + "]")

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
