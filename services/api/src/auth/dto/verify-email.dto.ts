import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  Transform,
} from 'class-transformer';

export class VerifyEmailDto {
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/^\d+$/, {
    message:
      'Verification code must contain digits only',
  })
  code!: string;
}