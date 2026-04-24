import { Expose, plainToInstance, Type } from 'class-transformer';
import { Article } from '../entities/article.entity';
import { ProfileDataDto } from './profile-response.dto';

export class ArticleDto {
  @Expose() slug: string;

  @Expose() title: string;

  @Expose() description: string;

  @Expose() body: string;

  @Expose() tagList: string[];

  @Expose() createdAt: Date;

  @Expose() updatedAt: Date;

  @Expose() favorited: boolean;

  @Expose() favoritesCount: number;

  @Expose()
  @Type(() => ProfileDataDto)
  author: ProfileDataDto;

  static build(
    article: Article,
    isFollowingAuthor: boolean,
    favoritedByCurrentUser: boolean,
  ): ArticleDto {
    return plainToInstance(
      ArticleDto,
      {
        ...article,
        tagList: article.tagList.map((tag) => tag.name),
        favorited: favoritedByCurrentUser,
        favoritesCount: article.favoritedBy.length,
        author: ProfileDataDto.build(article.author, isFollowingAuthor),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class SingleArticleResponseDto {
  @Expose()
  @Type(() => ArticleDto)
  article: ArticleDto;

  static build(
    article: Article,
    isFollowingAuthor: boolean,
    favoritedByCurrentUser: boolean,
  ): SingleArticleResponseDto {
    return plainToInstance(
      SingleArticleResponseDto,
      {
        article: ArticleDto.build(
          article,
          isFollowingAuthor,
          favoritedByCurrentUser,
        ),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class ArticleListItemDto {
  @Expose() slug: string;

  @Expose() title: string;

  @Expose() description: string;

  @Expose() tagList: string[];

  @Expose() createdAt: Date;

  @Expose() updatedAt: Date;

  @Expose() favorited: boolean;

  @Expose() favoritesCount: number;

  @Expose()
  @Type(() => ProfileDataDto)
  author: ProfileDataDto;

  static build(
    article: Article,
    isFollowingAuthor: boolean,
    favoritedByCurrentUser: boolean,
  ): ArticleListItemDto {
    return plainToInstance(
      ArticleListItemDto,
      {
        ...article,
        tagList: article.tagList.map((tag) => tag.name),
        favorited: favoritedByCurrentUser,
        favoritesCount: article.favoritedBy.length,
        author: ProfileDataDto.build(article.author, isFollowingAuthor),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class MultipleArticlesResponseDto {
  @Expose()
  @Type(() => ArticleListItemDto)
  articles: ArticleListItemDto[];
  @Expose()
  articlesCount: number;

  static build(
    articles: Article[],
    total: number,
    currentUserId: string | null,
    followingIds: Set<string>,
    favoritedIds: Set<string>,
  ): MultipleArticlesResponseDto {
    return plainToInstance(
      MultipleArticlesResponseDto,
      {
        articles: articles.map((article) =>
          ArticleListItemDto.build(
            article,
            followingIds.has(article.author.id),
            favoritedIds.has(article.id),
          ),
        ),
        articlesCount: total,
      },
      { excludeExtraneousValues: true },
    );
  }
}
