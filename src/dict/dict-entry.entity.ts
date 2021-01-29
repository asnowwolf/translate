import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dict')
export class DictEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  path: string;
  @Column()
  filename: string;
  @Column()
  xpath: string;
  @Column({ type: 'nvarchar', length: 256 })
  english: string;
  @Column({ type: 'nvarchar', length: 256 })
  chinese: string;
}
