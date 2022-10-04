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
    id_archivos_numerooficio: number;
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
    objetivo: string;
    @Column()
    marcolegal: string;

    @Column()
    state: string;
    @Column()
    created_at: string;
}