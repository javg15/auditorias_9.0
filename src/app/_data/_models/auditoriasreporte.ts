import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//esta entidad solo funciona como repositorio del reporte
@Entity()
export class Auditoriasreporte {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    desc_catentidades: string;
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
    desc_cattiposauditoria: string;
    @Column()
    desc_catservidores: string;
    @Column()
    desc_catresponsables: string;
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
    Detalle : string;
}