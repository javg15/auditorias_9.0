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
    original: number;
    @Column()
    simple: number;
    @Column()
    copia: number;

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
}