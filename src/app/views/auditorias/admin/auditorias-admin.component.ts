import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { AuditoriasService } from '../services/auditorias.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { environment } from 'src/environments/environment';
import { FindInPage } from 'electron-find'
import { remote } from 'electron'
import { JsonpClientBackend } from '@angular/common/http';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var $: any;
declare var jQuery: any;
const findInPage = new FindInPage(remote.getCurrentWebContents())

@Component({
  selector: 'app-auditorias-admin',
  templateUrl: './auditorias-admin.component.html',
  styleUrls: ['./auditorias-admin.component.css']
})


export class AuditoriasAdminComponent implements OnInit {
  @Input() dtOptions: DataTables.Settings = {};
  /* El decorador @ViewChild recibe la clase DataTableDirective, para luego poder
  crear el dtElement que represente la tabla que estamos creando. */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtTrigger: Subject<DataTableDirective> = new Subject();

  Members: any[];
  ColumnNames: string[];

  NumberOfMembers = 0;
  API_URL = environment.APIS_URL;

  private dtOptionsAdicional = { datosBusqueda: {campo: 0, operador: 0, valor: ''},raw:0};

  nombreModulo = 'Auditorias';
  tituloBotonReporte='Reporte';
  headersAdmin: any;
  userrol:string="";

  /* En el constructor creamos el objeto auditoriasService,
  de la clase HttpConnectService, que contiene el servicio mencionado,
  y estará disponible en toda la clase de este componente.
  El objeto es private, porque no se usará fuera de este componente. */
  constructor(
    private auditoriasService: AuditoriasService,private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
  ) {
    this.userrol=this.tokenStorage.getUser().id_permgrupos;
  }

  ngOnInit(): void {

    this.headersAdmin = JSON.parse(this.route.snapshot.data.userdata.data[0].cabeceras);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      //destroy : true,s

      searching: false,
      info: true,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
      },
      // Use this attribute to enable the responsive extension
      responsive: true,
      ajax: async (dataTablesParameters: any, callback) => {
        this.dtOptionsAdicional.raw++;
        dataTablesParameters.opcionesAdicionales = this.dtOptionsAdicional;
        
        var self = this;
        await this.auditoriasService.getAdmin(dataTablesParameters).then(function(resp:any){

          self.ColumnNames = resp.columnNames;
          self.Members = resp.data;
          self.NumberOfMembers = resp.data.length;
          $('.dataTables_length>label>select, .dataTables_filter>label>input').addClass('form-control-sm');
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
          if (self.NumberOfMembers > 0) {
            $('.dataTables_empty').css('display', 'none');
          }
          
        });
      },
      columns: this.headersAdmin,
      columnDefs: [{ "visible": false, "searchable": false, "targets": 0 }
        , { "width": "5%", "targets": 1 }]
    };

  }
  openModal(id: string, accion: string, idItem: number) {
    this.auditoriasService.open(id, accion, idItem);
  }

  closeModal(id: string) {
    this.auditoriasService.close(id);
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Hay que dessuscribirse del evento dtTrigger, para poder recrear la tabla.
    this.dtTrigger.unsubscribe();
  }

  reDraw(datosBusqueda: any = null): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      if(datosBusqueda!=null){
        this.dtOptionsAdicional.datosBusqueda = datosBusqueda;
        // Destruimos la tabla
        dtInstance.destroy();
        // dtTrigger la reconstruye
        this.dtTrigger.next();
      }
      else{
        dtInstance.clear().draw(false); // viene de form, solo actualiza la vista actual (current page)
      }
    });
  }

  busquedaAvanzada(){
    this.openModal('custom-modal-3','reporte',0)
    setTimeout(async ()=>{ await findInPage.openFindWindow()}, 1500);
  }

  async exportExcel() {
    let dataTablesParameters:any={"draw":1,"columns":[{"data":"id","name":"0","searchable":false,"orderable":true,"search":{"value":"","regex":false}},{"data":"modalidad","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"ente fis","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"nombre","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"ejercicio","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"tipo","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"rubros a revisar","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"estatus","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"obser","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},{"data":"acciones","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}}],"order":[{"column":0,"dir":"asc"}],"start":0,"length":1000,"search":{"value":"","regex":false},"opcionesAdicionales":{"datosBusqueda":{"campo":0,"operador":0,"valor":""},"raw":1}};
    dataTablesParameters.opcionesAdicionales = this.dtOptionsAdicional;
    const that=this
    await this.auditoriasService.getAdmin(dataTablesParameters).then(async function(resp:any){
      
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('PlantillasSheet');
        worksheet.addTable({
          name: "MyTable",
          ref: "A1",
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleLight1',
            showRowStripes: true,
            showColumnStripes: false,
          },
          columns: [
            { name: "-" },//inicializar
          ],
          rows: [],
        });


        const table = worksheet.getTable("MyTable");

        that.headersAdmin.forEach(e => {
          if(e.title.toUpperCase()!="ACCIONES" 
            && e.title.toUpperCase()!="ID"
            && e.title.toUpperCase()!="FOTO"
            )
            table.addColumn({
                name: e.title,
              },[],e.index);

        });

        for(let e of resp.data) {
          let row=[""];
        
          for(let i=0,j=0;i<that.headersAdmin.length;i++){ //=1 para quitar ID, -1 para quitar acciones
            if(that.headersAdmin[i].title.toUpperCase()!="ACCIONES" 
              && that.headersAdmin[i].title.toUpperCase()!="ID"
              && that.headersAdmin[i].title.toUpperCase()!="FOTO"
              ){
                row[++j]=e[that.headersAdmin[i].title] //agregar dato de campo
              }
          }
          table.addRow(row)
        }
        table.commit();
        
        await workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Plantillas.xlsx');
        })
      })
      
  }
}
