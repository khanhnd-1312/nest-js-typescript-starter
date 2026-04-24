import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import slugify from 'slugify';
import { randomBytes } from 'crypto';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { Follow } from './entities/follow.entity';
import { SingleArticleResponseDto } from './dto/article-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UsersService } from '../users/users.service';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    private readonly dataSource: DataSource,
    private readonly i18n: I18nService,
    private readonly usersService: UsersService,
  ) {}

  // Generate a unique slug based on the article title
  private generateSlug(title: string): string {
    const base = slugify(title, { lower: true, strict: true });
    const suffix = randomBytes(4).toString('hex');

    return `${base}-${suffix}`;
  }

  // Resolve tag names to Tag entities, creating new ones if they don't exist
  private async resolveOrCreateTags(
    tagRepo: Repository<Tag>,
    tagNames: string[],
  ): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const name of tagNames) {
      let tag = await tagRepo.findOne({ where: { name } });

      if (!tag) {
        tag = tagRepo.create({ name });
        tag = await tagRepo.save(tag);
      }

      tags.push(tag);
    }

    return tags;
  }

  // Find an article by its slug, throwing an error if not found
  private async findArticleBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tagList', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(
        this.i18n.translate('article.ARTICLE_NOT_FOUND'),
      );
    }

    return article;
  }

  async createArticle(
    dto: CreateArticleDto,
    authorId: string,
  ): Promise<SingleArticleResponseDto> {
    const author = await this.usersService.findById(authorId);

    return this.dataSource.transaction(async (manager) => {
      const tagRepo = manager.getRepository(Tag);
      const articleRepo = manager.getRepository(Article);

      const { title, description, body, tagList = [] } = dto;
      const tags = await this.resolveOrCreateTags(tagRepo, tagList);

      const article = articleRepo.create({
        slug: this.generateSlug(title),
        title,
        description,
        body,
        author,
        tagList: tags,
        favoritedBy: [], // Initialize with empty favorites
      });

      try {
        const saved = await articleRepo.save(article);

        return SingleArticleResponseDto.build(saved, false, false);
      } catch {
        throw new BadRequestException(
          this.i18n.translate('article.CREATE_FAILED'),
        );
      }
    });
  }

  async getArticle(
    slug: string,
    currentUserId: string | null,
  ): Promise<SingleArticleResponseDto> {
    const article = await this.findArticleBySlug(slug);

    const isFollowing = currentUserId
      ? (await this.followRepository.countBy({
          followerId: currentUserId,
          followingId: article.author.id,
        })) > 0
      : false;

    const isFavorited = currentUserId
      ? article.favoritedBy.some((u) => u.id === currentUserId)
      : false;

    return SingleArticleResponseDto.build(article, isFollowing, isFavorited);
  }

  async updateArticle(
    slug: string,
    dto: UpdateArticleDto,
    currentUserId: string,
  ): Promise<SingleArticleResponseDto> {
    const article = await this.findArticleBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException(this.i18n.translate('article.FORBIDDEN'));
    }

    const { title, description, body } = dto;

    if (title !== undefined) {
      article.title = title;
      article.slug = this.generateSlug(title); // Regenerate slug if title changes
    }
    if (description !== undefined) article.description = description;
    if (body !== undefined) article.body = body;

    try {
      const saved = await this.articleRepository.save(article);

      const isFavorited = saved.favoritedBy.some(
        (user) => user.id === currentUserId,
      );

      return SingleArticleResponseDto.build(saved, false, isFavorited);
    } catch {
      throw new BadRequestException(
        this.i18n.translate('article.UPDATE_FAILED'),
      );
    }
  }

  async deleteArticle(slug: string, currentUserId: string): Promise<void> {
    const article = await this.findArticleBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException(this.i18n.translate('article.FORBIDDEN'));
    }

    await this.articleRepository.remove(article);
  }
}
