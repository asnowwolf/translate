/* tslint:disable:no-inferrable-types */
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { DictEntryConfidence } from './dict';
import { SentenceFormat } from '../translator/sentence-format';

@Entity('dict')
export class DictEntryEntity {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;
  @Column({ default: '' })
  path: string = '';
  @Column({ type: 'nvarchar', length: 2048 })
  english: string;
  @Column({ type: 'nvarchar', length: 2048 })
  chinese: string;
  @Column({ type: 'nvarchar', length: 2048 })
  fingerprint: string;
  @Column({ type: 'nvarchar', length: 256, default: 'html' })
  format: SentenceFormat;
  @Column({ type: 'nvarchar', length: 256 })
  confidence: DictEntryConfidence;
  @Column({ default: false })
  isRegExp: boolean;
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
