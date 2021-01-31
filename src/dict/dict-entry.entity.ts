/* tslint:disable:no-inferrable-types */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
  @Column()
  confidence: DictEntryConfidence;
  @Column({ default: false })
  isRegExp: boolean = false;
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}

type DictEntryConfidence =
// 人工翻译
  'Manual' |
  // 词典精确翻译：文件名一致
  'DictAccurate' |
  // 词典模糊翻译：文件名不一致
  'DictFuzzy' |
  // 翻译引擎自动翻译
  'Engine';
