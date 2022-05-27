import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditoriasdetalle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_auditorias: number;

    @Column()
    punto: string;

    @Column()
    observacion: string;
    @Column()
    fecharecepcion: string;
    @Column()
    fechalimite: string;
    @Column()
    oficio: string;
    @Column()
    id_archivos: number;

    @Column()
    state: string;
}