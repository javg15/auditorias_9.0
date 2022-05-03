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
    numerooficio: string;
    @Column()
    id_catejercicios: string; //funciona solo para concatenar los ids y mostrarlos en el formulario
    @Column()
    fecha: string;
    @Column()
    periodoini: string;
    @Column()
    periodofin: string;
    @Column()
    id_cattiposauditoria: number;
    @Column()
    id_catservidores: number;
    @Column()
    id_catresponsables: number;
    @Column()
    rubros: string;
    @Column()
    numeroauditoria: string;
    @Column()
    numerooficionoti1: string;
    @Column()
    numerooficionoti2: string;
    @Column()
    numerooficionoti3: string;
    @Column()
    numeroofisol1: string;
    @Column()
    numeroofisol2: string;
    @Column()
    numeroofisol3: string;
    @Column()
    objetivo: string;
    @Column()
    marcolegal: string;

    @Column()
    state: string;
}