import { Expose, plainToInstance, Type } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserDataDto {
  @Expose() email: string;
  @Expose() username: string;
  @Expose() bio: string | null;
  @Expose() image: string | null;
  @Expose() token?: string;
}

export class UserResponseDto {
  @Expose()
  @Type(() => UserDataDto)
  user: UserDataDto;

  static build(user: User, token?: string): UserResponseDto {
    return plainToInstance(
      UserResponseDto,
      {
        user: { ...user, token },
      },
      { excludeExtraneousValues: true },
    );
  }
}
