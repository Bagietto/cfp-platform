import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpeakerDTO } from '@cfp-platform/shared-types';
import { firstValueFrom } from 'rxjs';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SubmissionStatus = 'idle' | 'submitting' | 'submitted' | 'error';

export class CfpSubmissionFormModel {
  readonly submissionStatus = signal<SubmissionStatus>('idle');
  readonly lastSubmittedSpeaker = signal<SpeakerDTO | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly form;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      id: [this.createSubmissionId(), [Validators.required, Validators.pattern(UUID_PATTERN)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      talkTitle: ['', [Validators.required, Validators.maxLength(120)]],
      isGDE: [false],
    });
  }

  get isSubmitDisabled() {
    return this.form.invalid || this.submissionStatus() === 'submitting';
  }

  showError(controlName: 'name' | 'email' | 'talkTitle') {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  describedBy(controlName: 'name' | 'email' | 'talkTitle') {
    return this.showError(controlName) ? `speaker-${controlName}-error` : null;
  }

  markSubmitting() {
    this.submissionStatus.set('submitting');
    this.errorMessage.set(null);
  }

  markSubmitted(response: SpeakerDTO) {
    this.lastSubmittedSpeaker.set(response);
    this.submissionStatus.set('submitted');
    this.form.reset({
      id: this.createSubmissionId(),
      name: '',
      email: '',
      talkTitle: '',
      isGDE: false,
    });
  }

  markError(message: string) {
    this.submissionStatus.set('error');
    this.errorMessage.set(message);
  }

  private createSubmissionId() {
    return crypto.randomUUID();
  }
}

@Component({
  selector: 'app-cfp-submission',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="cfp-card" aria-labelledby="cfp-title">
      <div class="hero">
        <p class="kicker">Speaker intake</p>
        <h2 id="cfp-title">Submit your conference talk</h2>
        <p>
          Share your proposal details below. We validate the same payload shape in
          the browser and in the API.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field">
          <label for="speaker-id">Submission ID</label>
          <input
            id="speaker-id"
            type="text"
            formControlName="id"
            readonly
            aria-describedby="speaker-id-help"
          />
          <small id="speaker-id-help">Generated automatically before submission.</small>
        </div>

        <div class="field">
          <label for="speaker-name">Speaker name</label>
          <input
            id="speaker-name"
            type="text"
            formControlName="name"
            [attr.aria-invalid]="model.showError('name')"
            [attr.aria-describedby]="model.describedBy('name')"
          />
          <p *ngIf="model.showError('name')" id="speaker-name-error" class="error" role="alert">
            Enter the speaker name.
          </p>
        </div>

        <div class="field">
          <label for="speaker-email">Email</label>
          <input
            id="speaker-email"
            type="email"
            formControlName="email"
            [attr.aria-invalid]="model.showError('email')"
            [attr.aria-describedby]="model.describedBy('email')"
          />
          <p *ngIf="model.showError('email')" id="speaker-email-error" class="error" role="alert">
            Enter a valid email address.
          </p>
        </div>

        <div class="field">
          <label for="speaker-talk-title">Talk title</label>
          <input
            id="speaker-talk-title"
            type="text"
            formControlName="talkTitle"
            [attr.aria-invalid]="model.showError('talkTitle')"
            [attr.aria-describedby]="model.describedBy('talkTitle')"
          />
          <p
            *ngIf="model.showError('talkTitle')"
            id="speaker-talkTitle-error"
            class="error"
            role="alert"
          >
            Enter the talk title.
          </p>
        </div>

        <div class="field checkbox-field">
          <label for="speaker-is-gde">
            <input id="speaker-is-gde" type="checkbox" formControlName="isGDE" />
            I am a Google Developer Expert
          </label>
        </div>

        <button type="submit" [disabled]="model.isSubmitDisabled">
          {{ model.submissionStatus() === 'submitting' ? 'Submitting...' : 'Submit proposal' }}
        </button>

        <p *ngIf="model.submissionStatus() === 'submitted'" class="success" role="status">
          Proposal submitted for {{ model.lastSubmittedSpeaker()?.name }}.
        </p>

        <p *ngIf="model.submissionStatus() === 'error'" class="error" role="alert">
          {{ model.errorMessage() }}
        </p>
      </form>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .cfp-card {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(122, 52, 25, 0.12);
        border-radius: 28px;
        box-shadow: 0 24px 70px rgba(122, 52, 25, 0.08);
        padding: clamp(1.5rem, 4vw, 2.5rem);
      }

      .hero {
        margin-bottom: 1.5rem;
      }

      .kicker {
        margin: 0 0 0.4rem;
        color: #b45309;
        font-size: 0.78rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      h2 {
        margin: 0 0 0.75rem;
        font-size: clamp(1.6rem, 4vw, 2.4rem);
      }

      form {
        display: grid;
        gap: 1rem;
      }

      .field {
        display: grid;
        gap: 0.45rem;
      }

      label {
        font-weight: 600;
      }

      input[type='text'],
      input[type='email'] {
        border: 1px solid #d6c0ab;
        border-radius: 14px;
        padding: 0.85rem 0.95rem;
        font: inherit;
        background: #fffdf9;
      }

      input[aria-invalid='true'] {
        border-color: #c2410c;
      }

      .checkbox-field label {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      button {
        border: 0;
        border-radius: 999px;
        background: linear-gradient(135deg, #9a3412 0%, #ea580c 100%);
        color: white;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0.9rem 1.25rem;
      }

      button:disabled {
        background: #d6c0ab;
        cursor: not-allowed;
      }

      .error {
        color: #c2410c;
        margin: 0;
      }

      .success {
        color: #166534;
        margin: 0;
      }

      small {
        color: #7c5f49;
      }
    `,
  ],
})
export class CfpSubmissionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly model = new CfpSubmissionFormModel(this.fb);
  readonly form = this.model.form;

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.model.markSubmitting();

    try {
      const payload: SpeakerDTO = this.form.getRawValue();
      const response = await firstValueFrom(
        this.http.post<SpeakerDTO>('/api/cfp/submissions', payload),
      );

      this.model.markSubmitted(response);
    } catch {
      this.model.markError('We could not submit your proposal. Please try again.');
    }
  }
}
