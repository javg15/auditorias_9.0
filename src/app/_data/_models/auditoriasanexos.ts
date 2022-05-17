import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditoriasanexos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_auditoriasdetalle: number;

    @Column()
    puntoanexo: number;
    @Column()
    id_archivos: number;
    @Column()
    state: string;
}