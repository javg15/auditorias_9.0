import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Catservidores {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    departamento: string;

    @Column()
    puesto: string;

    @Column()
    state: string;
}