import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auditoriasejercicios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_auditorias: number;

    @Column()
    id_catejercicios: number;

}