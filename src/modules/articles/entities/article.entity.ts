import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.articles, { eager: false, cascade: true })
  @JoinTable({ name: 'article_tags' })
  tagList: Tag[];

  @OneToMany(() => Comment, (comment) => comment.article, { eager: false })
  comments: Comment[];

  @ManyToMany(() => User, { eager: false })
  @JoinTable({ name: 'article_favorites' })
  favoritedBy: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
