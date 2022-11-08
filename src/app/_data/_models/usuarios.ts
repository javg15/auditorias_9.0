import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Usuarios  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  id_permgrupos: number;

  @Column()
  state: string;

  @Column()
  created_at: string;
}