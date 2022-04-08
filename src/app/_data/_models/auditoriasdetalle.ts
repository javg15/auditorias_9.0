import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditoriasdetalle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_auditorias: number;

    @Column()
    punto: number;

    @Column()
    observacion: string;
    @Column()
    id_catresponsables: number;
    @Column()
    fechaobservacion: string;
    @Column()
    fechalimite: string;

    @Column()
    state: string;
}