import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Catentidades {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombrecorto: string;

    @Column()
    nombrelargo: string;
    @Column()
    domicilio: string;
    @Column()
    id_catresponsables: number;

    @Column()
    state: string;
}