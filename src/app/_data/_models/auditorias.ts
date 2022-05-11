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
    id_archivos_numerooficionoti1: number;
    @Column()
    numerooficionoti2: string;
    @Column()
    id_archivos_numerooficionoti2: number;
    @Column()
    numerooficionoti3: string;
    @Column()
    id_archivos_numerooficionoti3: number;
    @Column()
    numeroofisol1: string;
    @Column()
    id_archivos_numeroofisol1: number;
    @Column()
    numeroofisol2: string;
    @Column()
    id_archivos_numeroofisol2: number;
    @Column()
    numeroofisol3: string;
    @Column()
    id_archivos_numeroofisol3: number;
    @Column()
    objetivo: string;
    @Column()
    marcolegal: string;

    @Column()
    state: string;
}