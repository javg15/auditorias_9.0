import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter} from '@angular/core';
import { SearchService } from '../../../_services/search.service';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import * as moment from 'moment';

import { NgSelect2Module } from 'ng-select2';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-search-admin',
  templateUrl: './search-admin.component.html',
  styleUrls: ['./search-admin.component.css']
})

export class SearchAdminComponent implements OnInit {
  @Input() nombreModulo: string;
  @Output() buscarEvent = new EventEmitter<any>();
  
  private conn:Connection;

  isCollapsed: boolean = true;
  itemsCampos: Array<any> = [{id: 0, idesc: '', orden: 0}];
  itemsOperadores: Array<Array<any>> = [[{id: 0, idesc: '', orden: 0}]
              ,[{id: 0, idesc: '', orden: 0}]
              ,[{id: 0, idesc: '', orden: 0}]
              ,[{id: 0, idesc: '', orden: 0}]
              ,[{id: 0, idesc: '', orden: 0}]];

  selectedItemsCampos: Array<any> = [{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}];

  selectedItemsOperadores: Array<any> = [{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}
                            ,{id: 0, idesc: '', orden: 0}];

  tipoEdicion:Array<number>= [0,0,0,0,0];
  valorBuscar: Array<string>= ['','','','',''];
  cuentaVisibles:number=1;

  comboCat:Array<Array<any>>=[[{id:"---------",text:"----------"}]
                            ,[{id:"---------",text:"----------"}]
                            ,[{id:"---------",text:"----------"}]
                            ,[{id:"---------",text:"----------"}]
                            ,[{id:"---------",text:"----------"}]];
  options0: Array<any>=[{},{},{},{},{}]
  options1: Array<any>=[{multiple: true, closeOnSelect: false, width: '300'},
                        {multiple: true, closeOnSelect: false, width: '300'},
                        {multiple: true, closeOnSelect: false, width: '300'},
                        {multiple: true, closeOnSelect: false, width: '300'},
                        {multiple: true, closeOnSelect: false, width: '300'},
                        ]
  tipoOptions:Array<number>= [0,0,0,0,0];

  constructor(private searchService: SearchService,private dbSvc: DatabaseService) {
  }

  async ngOnInit(): Promise<void> {
    this.conn= await this.dbSvc.connection;
    await this.searchService.getSearchcampos(this.nombreModulo).then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        this.itemsCampos.push({
          id: resp.data[i].id,
          idesc: resp.data[i].idesc,
          orden: resp.data[i].orden,
          edicion:resp.data[i].edicion,
          valores:(resp.data[i].edicion==1 ? this.getSearchValores(this.nombreModulo,resp.data[i].campo) : ''),
        });
      }
    });

    this.onSelectCampos(0,this.selectedItemsCampos[0].id);
  }

  ngOnDestroy(): void {

  }

  async getSearchValores(_modulo:string,_campo:string):Promise<any>{
    let _respuesta="",	_i =0;
	
    if (_modulo.toLowerCase()=='categorias'){
      if (_campo.toLowerCase()=='anio'){
        
        for(_i=2019; _i<=moment().year();_i++){
          _respuesta+=','+'{"id":"'+_i+'","text":"'+_i+'"}';
        }
        
        if(_respuesta.length>0){
            _respuesta=_respuesta.substring(1);
        }
      }
      else if (_campo.toLowerCase()=='id_tiponomina')
        _respuesta=await this.conn.query('SELECT group_concat(\'{"id":"\' || m.id || \'","text":"\' || m.descripcion || \'"}\',\',\') '
          + 'FROM catejercicios as m');
    }
	  return  '[' + _respuesta + ']';
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  async onSelectCampos(idx, id_campo) {
    this.itemsOperadores[idx] = [{id: 0, idesc: '', orden: 0}];
    this.tipoEdicion[idx]=this.itemsCampos.find(a=>a.id==id_campo).edicion;
    this.valorBuscar[idx]="";
    if(this.tipoEdicion[idx]==1){//combo
      this.comboCat[idx]=JSON.parse(this.itemsCampos.find(a=>a.id==id_campo).valores);
    }

    await this.searchService.getSearchoperadores(id_campo).then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        if(i==0){
          this.selectedItemsOperadores[idx].id=resp.data[0].id;
        }

        this.itemsOperadores[idx].push({
          id: resp.data[i].id,
          idesc: resp.data[i].idesc,
          orden: resp.data[i].orden
        });
      }
    });
  }

  onSelectOperador(idx, id_operador){
    if(id_operador==19)//id=19->'incluye' de la tabla searchoperador
      this.tipoOptions[idx]=1
    else
      this.tipoOptions[idx]=0

    this.valorBuscar[idx]="" //reiniciar
  }

  onSelectComboValor(idx,valor){
    this.valorBuscar[idx]=valor;
  }


  onClickBuscar() {
    let campo:Array<any>=[];
    let operador:Array<any>=[];
    let valor:Array<any>=[];
    //verificar los renglones multicriterio
    for(let i=0;i<this.cuentaVisibles;i++){
      campo.push(this.selectedItemsCampos[i].id);
      operador.push(this.selectedItemsOperadores[i].id);
      valor.push(this.valorBuscar[i]);
    }
    let buscarItems:any={campo:campo.join('|'),operador:operador.join('|'),valor:valor.join('|')};
    this.buscarEvent.emit(buscarItems);
  }

  onClickClear() {
    this.selectedItemsCampos = [{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}];
    this.selectedItemsOperadores = [{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}
    ,{id: 0, idesc: '', orden: 0}];
    this.valorBuscar = ['','','','',''];
    this.cuentaVisibles=1;
    this.onClickBuscar();
  }

  onClickAddMinus(accion){
    if(accion==1 && this.cuentaVisibles<5) this.cuentaVisibles++;
    if(accion==2 && this.cuentaVisibles>1) this.cuentaVisibles--;
  }
}
