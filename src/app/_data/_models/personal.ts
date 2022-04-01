// Automatically generated. Don't change this file manually.

export default interface Personal {
  /** Primary key. Index: personal_pkey */
  id: number;

  curp: string;

  rfc: string;

  homoclave: string;

  nombre: string;

  apellidopaterno: string;

  apellidomaterno: string;

  id_catestadocivil: number;

  sexo: number;

  fechanacimiento: Date | null;

  id_catestadosresi: number;

  id_catmunicipiosresi: number;

  id_catlocalidadesresi: number;

  id_catestadosnaci: number;

  id_catmunicipiosnaci: number;

  id_catlocalidadesnaci: number;

  id_archivos_avatar: number;

  id_usuarios_sistema: number;

  telefono: string;

  email: string;

  emailoficial: string;

  observaciones: string | null;

  numeemp: string | null;


  domicilio: string | null;
  colonia: string | null;
  cp: string | null;
  telefonomovil: string | null;
  numimss: string | null;
  numissste: string | null;
  otronombre: string | null;
  numotro: string | null;
  tipopension: string | null;

  id_usuarios_r: number;

  state: string;

  created_at: Date | null;

  updated_at: Date | null;

  fechaingreso: Date| null;

  primaantiguedad: number;

  id_catbanco_deposito: number | null;

  cuentadeposito:string | null;

  formacobro: number;
}

export interface PersonalInitializer {
  /**
   * Default value: nextval('personal_id_seq'::regclass)
   * Primary key. Index: personal_pkey
   */
  id?: number;

  curp: string;

  rfc: string;

  homoclave: string;

  nombre: string;

  apellidopaterno: string;

  apellidomaterno: string;

  id_catestadocivil: number;

  sexo: number;

  fechanacimiento: Date;

  id_catestadosresi: number;

  id_catmunicipiosresi: number;

  id_catlocalidadesresi: number;

  id_catestadosnaci: number; id_catmunicipiosnaci: number; id_catlocalidadesnaci: number;

  id_archivos_avatar: number;

  id_usuarios_sistema: number;

  telefono: string;

  email: string;

  emailoficial: string;

  observaciones?: string;

  numeemp?: string;

  domicilio?: string;colonia?: string;cp?: string;telefonomovil?: string;numimss?: string;numissste?: string;otronombre?: string; numotro?: string;tipopension:''

  /** Default value: 0 */
  id_usuarios_r?: number;

  /** Default value: 'A'::bpchar */
  state?: string;

  created_at?: Date;

  updated_at?: Date;

  fechaingreso?: Date;

  primaantiguedad?: number;

  id_catbanco_deposito?: number;

  cuentadeposito?:string;

  formacobro?: number;
}
