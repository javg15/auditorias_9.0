import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditorias {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_catentidades: number;

    @Column()
    nombre: string;

    @Column()
    oficio: string;
    @Column()
    numero: string;
    @Column()
    id_catejercicios: number;
    @Column()
    fecha: string;
    @Column()
    periodoini: string;
    @Column()
    periodofin: string;
    @Column()
    id_cattiposauditoria: number;
    @Column()
    marcolegal: string;
    @Column()
    id_catservidores: number;
    @Column()
    id_catresponsables: number;

    @Column()
    state: string;
}