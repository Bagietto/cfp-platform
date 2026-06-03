import { Injectable } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/shared-types';
import { CfpSubmissionDto } from './dto/cfp-submission.dto';

@Injectable()
export class CfpService {
  submit(submission: CfpSubmissionDto): SpeakerDTO {
    return { ...submission };
  }
}
