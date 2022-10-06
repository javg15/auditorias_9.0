import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Catestatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descripcion: string;

    @Column()
    state: string;
}