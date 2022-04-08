import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cattiposauditoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    state: string;
}