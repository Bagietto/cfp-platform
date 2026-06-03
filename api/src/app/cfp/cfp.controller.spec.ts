import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { createStrictValidationPipe } from '../validation';

describe('CfpController validation', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createStrictValidationPipe());
    await app.listen(0);

    const address = app.getHttpServer().address();
    baseUrl = `http://127.0.0.1:${String(address.port)}/api/cfp/submissions`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a payload with a missing required field', async () => {
    const response = await postSubmission({
      id: '8d2dbf4d-c00f-4cf8-a4c1-a71b853ec9db',
      email: 'speaker@example.com',
      talkTitle: 'Strict validation at the edge',
      isGDE: false,
    });

    expect(response.status).toBe(400);
  });

  it('rejects a payload with an invalid email format', async () => {
    const response = await postSubmission({
      id: '8d2dbf4d-c00f-4cf8-a4c1-a71b853ec9db',
      name: 'Alex Speaker',
      email: 'not-an-email',
      talkTitle: 'Signals for better UX',
      isGDE: true,
    });

    expect(response.status).toBe(400);
  });

  it('rejects a payload with unexpected fields', async () => {
    const response = await postSubmission({
      id: '8d2dbf4d-c00f-4cf8-a4c1-a71b853ec9db',
      name: 'Alex Speaker',
      email: 'speaker@example.com',
      talkTitle: 'Signals for better UX',
      isGDE: true,
      track: 'frontend',
    });

    expect(response.status).toBe(400);
  });

  async function postSubmission(body: unknown) {
    return fetch(baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
});
