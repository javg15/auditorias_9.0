// Automatically generated. Don't change this file manually.

export type SearchoperadorId = number & { __flavor?: 'searchoperador' };

export default interface Searchoperador {
  /** Primary key. Index: searchoperador_pkey */
  id: SearchoperadorId;

  tipo: number;

  etiqueta: string;

  operador: string;

  orden: number;

  id_usuarios_r: number;

  state: string;

  created_at: Date | null;

  updated_at: Date | null;
}

export interface SearchoperadorInitializer {
  /**
   * Default value: nextval('searchoperador_id_seq'::regclass)
   * Primary key. Index: searchoperador_pkey
   */
  id?: SearchoperadorId;

  /** Default value: 1 */
  tipo?: number;

  /** Default value: ''::character varying */
  etiqueta?: string;

  /** Default value: ''::character varying */
  operador?: string;

  /** Default value: 1 */
  orden?: number;

  /** Default value: 0 */
  id_usuarios_r?: number;

  /** Default value: 'A'::bpchar */
  state?: string;

  created_at?: Date;

  updated_at?: Date;
}
