## Purpose

Define the Call for Papers submission capability across the Angular frontend and NestJS backend, including the shared payload contract, validation behavior, accessibility expectations, and critical test coverage.

## Requirements

### Requirement: Speaker can submit a talk proposal from the frontend
The system SHALL provide a Call for Papers submission form in the Angular frontend using Standalone Components and Signals to manage submission state.

#### Scenario: Initial submission state is inactive
- **WHEN** the CFP submission component is first rendered
- **THEN** the Signal-based submission state SHALL indicate that no submission is in progress or completed
- **AND** the submit button SHALL be disabled until the required data is valid

#### Scenario: Accessible submission form is presented
- **WHEN** a speaker accesses the CFP submission page
- **THEN** the form SHALL expose accessible labels for all interactive fields
- **AND** validation feedback SHALL be associated to the corresponding controls using semantic or WAI-ARIA attributes

### Requirement: Frontend and backend must share the speaker contract
The system SHALL use the `SpeakerDTO` exported by `shared-types` as the shared contract for the CFP submission payload across frontend and backend boundaries.

#### Scenario: Frontend builds payload from shared contract
- **WHEN** the frontend prepares a submission payload
- **THEN** it SHALL use the field structure defined by `SpeakerDTO`

#### Scenario: Backend accepts payload aligned to shared contract
- **WHEN** the backend receives a CFP submission request
- **THEN** the accepted payload shape SHALL correspond to the fields defined by `SpeakerDTO`

### Requirement: Backend must strictly validate CFP submissions
The system SHALL expose a NestJS endpoint that receives the submission payload through `@Body()` and rejects invalid input with `400 Bad Request` using `class-validator`-based validation.

#### Scenario: Missing required field is rejected
- **WHEN** a submission request omits a required speaker field
- **THEN** the API SHALL respond with `400 Bad Request`

#### Scenario: Invalid field format is rejected
- **WHEN** a submission request contains an invalid field format such as an invalid email value
- **THEN** the API SHALL respond with `400 Bad Request`

#### Scenario: Unexpected payload field is rejected
- **WHEN** a submission request includes properties outside the validated CFP contract
- **THEN** the API SHALL respond with `400 Bad Request`

### Requirement: CFP module must include unit test coverage for critical behaviors
The system SHALL include Jest unit tests covering the frontend initial Signal state and disabled submit behavior, as well as backend rejection of invalid payloads.

#### Scenario: Frontend test verifies initial Signal state
- **WHEN** the frontend unit test suite runs for the CFP submission component
- **THEN** it SHALL verify the initial Signal-driven state before any user interaction

#### Scenario: Frontend test verifies disabled submit
- **WHEN** the frontend unit test suite runs with an invalid or incomplete form
- **THEN** it SHALL verify that the submit button remains disabled

#### Scenario: Backend test verifies invalid payload rejection
- **WHEN** the backend unit test suite sends invalid CFP payloads to the validated endpoint
- **THEN** it SHALL verify `400 Bad Request` responses
