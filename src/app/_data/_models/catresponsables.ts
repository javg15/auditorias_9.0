import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Catresponsables {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    state: string;
}