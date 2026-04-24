import { Expose, plainToInstance, Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export class ProfileDataDto {
  @Expose() username: string;
  @Expose() bio: string | null;
  @Expose() image: string | null;
  @Expose() following: boolean;

  static build(user: User, isFollowing: boolean): ProfileDataDto {
    return plainToInstance(
      ProfileDataDto,
      { ...user, following: isFollowing },
      { excludeExtraneousValues: true },
    );
  }
}

export class ProfileResponseDto {
  @Expose()
  @Type(() => ProfileDataDto)
  profile: ProfileDataDto;

  static build(user: User, following: boolean): ProfileResponseDto {
    return plainToInstance(
      ProfileResponseDto,
      { profile: ProfileDataDto.build(user, following) },
      { excludeExtraneousValues: true },
    );
  }
}
