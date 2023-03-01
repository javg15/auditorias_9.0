import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditoriasanexos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_auditoriasdetalle: number;

    @Column()
    puntoanexo: string;
    @Column()
    id_archivos: number;
    @Column()
    nombre: string;
    @Column()
    observaciones: string;
    @Column()
    state: string;
    @Column()
    orden: number;
    @Column()
    created_at: string;
    @Column()
    updated_at: string;
    @Column()
    id_usuarios_r: number;
    @Column()
    usuarios_pc: string;
}