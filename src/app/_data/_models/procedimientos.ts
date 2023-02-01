import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Procedimientos {
    @PrimaryGeneratedColumn()
    punto: string;
    
    @Column()
    descripcion: string;
    
}