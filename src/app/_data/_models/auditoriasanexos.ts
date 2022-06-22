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
    state: string;
    @Column()
    orden: number;
}