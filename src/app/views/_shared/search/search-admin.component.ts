import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter} from '@angular/core';
import { SearchService } from '../../../_services/search.service';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import * as moment from 'moment';

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
  
    tipoOptions:Array<number>= [0,0,0,0,0];

  constructor(private searchService: SearchService,private dbSvc: DatabaseService) {
  }

  async ngOnInit(): Promise<void> {
    this.conn= await this.dbSvc.connection;
    await this.searchService.getSearchcampos(this.nombreModulo).then(async resp => {
      for (let i = 0; i < resp.data.length; i++) {
        this.itemsCampos.push({
          id: resp.data[i].id,
          idesc: resp.data[i].idesc,
          orden: resp.data[i].orden,
          edicion:resp.data[i].edicion,
          valores:(resp.data[i].edicion==1 ? await this.getSearchValores(this.nombreModulo,resp.data[i].campo) : ''),
        });
      }
    });

    this.onSelectCampos(0,this.selectedItemsCampos[0].id);
  }

  ngOnDestroy(): void {

  }

  async getSearchValores(_modulo:string,_campo:string):Promise<any>{
    let _respuesta="",	_i =0;
	
    if (_modulo.toLowerCase()=='auditorias'){
      if (_campo.toLowerCase()=='anio'){
        
        for(_i=2019; _i<=moment().year();_i++){
          _respuesta+=','+'{"value":"'+_i+'","label":"'+_i+'"}';
        }
        
        if(_respuesta.length>0){
            _respuesta=_respuesta.substring(1);
        }
      }
      else if (_campo.toLowerCase()=='id_catservidores')
        await this.conn.query('SELECT group_concat(\'{"value":"\' || m.id || \'","label":"\' || m.nombre || \'"}\',\',\') AS data '
          + 'FROM catservidores as m').then((datos)=>{
            _respuesta=(datos.length>0 ? datos[0].data : '')
          });
      else if (_campo.toLowerCase()=='id_catresponsables')
          await this.conn.query('SELECT group_concat(\'{"value":"\' || m.id || \'","label":"\' || m.nombre || \'"}\',\',\') AS data '
            + 'FROM catresponsables as m').then((datos)=>{
              _respuesta=(datos.length>0 ? datos[0].data : '')
            });
      else if (_campo.toLowerCase()=='cej.ejercicio')
          await this.conn.query('SELECT group_concat(\'{"value":"\' || m.ejercicio || \'","label":"\' || m.ejercicio || \'"}\',\',\') AS data '
            + 'FROM catejercicios as m').then((datos)=>{
              _respuesta=(datos.length>0 ? datos[0].data : '')
            });
    }
    else if (_modulo.toLowerCase()=='catentidades'){
      if (_campo.toLowerCase()=='id_catresponsables')
        await this.conn.query('SELECT group_concat(\'{"value":"\' || m.id || \'","label":"\' || m.nombre || \'"}\',\',\') AS data '
          + 'FROM catresponsables as m').then((datos)=>{
            _respuesta=(datos.length>0 ? datos[0].data : '')
          });
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
      console.log("this.itemsCampos=>",this.itemsCampos.find(a=>a.id==id_campo))
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
    if(id_operador==16)//id=19->'incluye' de la tabla searchoperador
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
