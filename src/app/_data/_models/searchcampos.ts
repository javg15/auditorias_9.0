// Automatically generated. Don't change this file manually.

export type SearchcamposId = number & { __flavor?: 'searchcampos' };

export default interface Searchcampos {
  /** Primary key. Index: searchcampos_pkey */
  id: SearchcamposId;

  etiqueta: string;

  campo: string;

  id_modulos: number;

  tipo: number;

  orden: number;

  id_usuarios_r: number;

  state: string;

  created_at: Date | null;

  updated_at: Date | null;
}

export interface SearchcamposInitializer {
  /**
   * Default value: nextval('searchcampos_id_seq'::regclass)
   * Primary key. Index: searchcampos_pkey
   */
  id?: SearchcamposId;

  /** Default value: ''::character varying */
  etiqueta?: string;

  /** Default value: ''::character varying */
  campo?: string;

  /** Default value: 0 */
  id_modulos?: number;

  /** Default value: 1 */
  tipo?: number;

  /** Default value: 0 */
  orden?: number;

  /** Default value: 0 */
  id_usuarios_r?: number;

  /** Default value: 'A'::bpchar */
  state?: string;

  created_at?: Date;

  updated_at?: Date;
}
