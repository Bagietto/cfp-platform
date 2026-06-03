import { FormBuilder } from '@angular/forms';
import { CfpSubmissionFormModel } from './cfp-submission.component';

describe('CfpSubmissionFormModel', () => {
  function createModel() {
    return new CfpSubmissionFormModel(new FormBuilder());
  }

  it('starts with an idle signal state and no completed submission', () => {
    const model = createModel();

    expect(model.submissionStatus()).toBe('idle');
    expect(model.lastSubmittedSpeaker()).toBeNull();
    expect(model.errorMessage()).toBeNull();
  });

  it('keeps the submit button state disabled while the form is incomplete', () => {
    const model = createModel();

    expect(model.isSubmitDisabled()).toBe(true);

    model.form.patchValue({
      name: 'Alex Speaker',
      email: 'speaker@example.com',
    });

    expect(model.isSubmitDisabled()).toBe(true);
  });
});
