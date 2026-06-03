import { Body, Controller, Post } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/shared-types';
import { CfpService } from './cfp.service';
import { CfpSubmissionDto } from './dto/cfp-submission.dto';

@Controller('cfp/submissions')
export class CfpController {
  constructor(private readonly cfpService: CfpService) {}

  @Post()
  submit(@Body() submission: CfpSubmissionDto): SpeakerDTO {
    return this.cfpService.submit(submission);
  }
}
