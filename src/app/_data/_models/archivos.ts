// Automatically generated. Don't change this file manually.

export default interface Archivos {
  /** Primary key. Index: archivos_pkey */
  id: number;

  tabla: string | null;

  id_tabla: number | null;

  tipo: string | null;

  nombre: string | null;

  datos: File | null;

  ruta: string | null;

  id_usuarios_r: number;

  state: string;

  created_at: Date | null;

  updated_at: Date | null;
}

export interface ArchivosInitializer {
  /**
   * Default value: nextval('archivos_id_seq'::regclass)
   * Primary key. Index: archivos_pkey
   */
  id?: number;

  tabla?: string;

  id_tabla?: number;

  tipo?: string;

  nombre?: string;

  datos?: File;

  /** Default value: 0 */
  id_usuarios_r?: number;

  /** Default value: 'A'::bpchar */
  state?: string;

  created_at?: Date;

  updated_at?: Date;
}
