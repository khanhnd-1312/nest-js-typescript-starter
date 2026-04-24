import { Expose, plainToInstance, Type } from 'class-transformer';
import { Comment } from '../entities/comment.entity';
import { ProfileDataDto } from './profile-response.dto';

export class CommentDto {
  @Expose() id: number;

  @Expose() createdAt: Date;

  @Expose() updatedAt: Date;

  @Expose() body: string;

  @Expose()
  @Type(() => ProfileDataDto)
  author: ProfileDataDto;

  static build(comment: Comment, isFollowingAuthor: boolean): CommentDto {
    return plainToInstance(
      CommentDto,
      {
        ...comment,
        author: ProfileDataDto.build(comment.author, isFollowingAuthor),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class SingleCommentResponseDto {
  @Expose()
  @Type(() => CommentDto)
  comment: CommentDto;

  static build(
    comment: Comment,
    isFollowingAuthor: boolean,
  ): SingleCommentResponseDto {
    return plainToInstance(
      SingleCommentResponseDto,
      {
        comment: CommentDto.build(comment, isFollowingAuthor),
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class MultipleCommentsResponseDto {
  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  static build(
    comments: Comment[],
    followingIds: Set<string>,
  ): MultipleCommentsResponseDto {
    return plainToInstance(
      MultipleCommentsResponseDto,
      {
        comments: comments.map((comment) =>
          CommentDto.build(comment, followingIds.has(comment.author.id)),
        ),
      },
      { excludeExtraneousValues: true },
    );
  }
}
