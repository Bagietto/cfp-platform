import { SpeakerDTO } from '@cfp-platform/shared-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

// Keep validation metadata aligned with the shared SpeakerDTO contract.
export class CfpSubmissionDto implements SpeakerDTO {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  talkTitle!: string;

  @IsBoolean()
  isGDE!: boolean;
}
