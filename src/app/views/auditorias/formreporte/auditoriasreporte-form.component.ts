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
  record_detalles:string="";

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
      marcolegal: '', desc_catresponsables:'',rubros: '',    numeroauditoria: '',    numerooficionoti1: '',numerooficionoti2: '',numerooficionoti3: '',
      numeroofisol1: '',     numeroofisol2: '',numeroofisol3: '',     objetivo: '', Detalle:'',
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
  makeMultiPage() {
 
        var quotes = document.getElementById('pdfTable');
        html2canvas(quotes).then(function (canvas) {
 
            //! MAKE YOUR PDF
            var pdf = new jsPDF('p', 'pt', 'letter');
 
            for (var i = 0; i <= quotes.clientHeight/980; i++) {
                //! This is all just html2canvas stuff
                var srcImg  = canvas;
                var sX      = 0;
                var sY      = 980*i; // start 980 pixels down for every new page
                var sWidth  = 900;
                var sHeight = 980;
                var dX      = 0;
                var dY      = 0;
                var dWidth  = 900;
                var dHeight = 980;
 
                let onePageCanvas = document.createElement("canvas");
                onePageCanvas.setAttribute('width', "900");
                onePageCanvas.setAttribute('height', "980");
                var ctx = onePageCanvas.getContext('2d');
                // details on this usage of this function:
                // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
 
                // document.body.appendChild(canvas);
                var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
 
                var width         = onePageCanvas.width;
                var height        = onePageCanvas.clientHeight;
 
                //! If we're on anything other than the first page,
                // add another page
                if (i > 0) {
                    pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
                }
                //! now we declare that we're working on that page
                pdf.setPage(i+1);
                //! now we add content to that page!
                pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));
 
            }
            //! after the for loop is finished running, we save the pdf.
            pdf.save(`auditorias_${new Date().toISOString()}.pdf`);
        });
    }

  // open modal
  async open(idItem: string, accion: string,idParent:number):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Reporte de auditoría";

    this.record=await this.auditoriasreporteService.getAdmin(idItem);
    this.record_detalles=JSON.parse("[" + this.record.Detalle + "]")

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
