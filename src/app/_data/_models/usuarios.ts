// Automatically generated. Don't change this file manually.

export type UsuariosId = number & { __flavor?: 'usuarios' };

export default interface Usuarios {
  /** Primary key. Index: usuarios_pk */
  id: UsuariosId;

  username: string;

  pass: string;

  uPassenc: string | null;

  perfil: number | null;

  nombre: string | null;

  numemp: string | null;

  record_catzonasgeograficas:string[] | null;

  created_at: Date | null;

  updated_at: Date | null;

  id_permgrupos: number | null;

  id_usuarios_r: number | null;

  state: string | null;

  email: string | null;

  id_archivos_avatar: number | null;
}

export interface UsuariosInitializer {
  /**
   * Default value: nextval('usuarios2_id_seq'::regclass)
   * Primary key. Index: usuarios_pk
   */
  id?: UsuariosId;

  username: string;

  pass: string;

  uPassenc?: string;

  perfil?: number;

  nombre?: string;

  numemp?: string;

  record_catzonasgeograficas?:string[];

  created_at?: Date;

  updated_at?: Date;

  id_permgrupos?: number;

  id_usuarios_r?: number;

  /** Default value: 'A'::bpchar */
  state?: string;

  email?: string;

  id_archivos_avatar?: number;
}

