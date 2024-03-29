import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Archivos {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tabla: string;
  @Column()
  id_tabla: number;
  @Column()
  tipo: string | null;
  @Column()
  nombre: string | null;
  @Column()
  ruta: string | null;
  @Column()
  numero: number;
  @Column()
  uuid: string | null;
  @Column()
  state: string | null;
  @Column()
  created_at: string;
  @Column()
  id_usuarios_r: number;
  @Column()
  usuarios_pc: string;
}

