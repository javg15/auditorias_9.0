import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Catejercicios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ejercicio: number;

    @Column()
    descripcion: string;
}