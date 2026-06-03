import { test, expect } from '@playwright/test';

test('front page has app title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to show the actual frontend application title.
  expect(await page.locator('h1').innerText()).toContain('Call for Papers');
});

test('can submit the CFP form', async ({ page }) => {
  await page.goto('/cfp');

  await page.fill('#speaker-name', 'Test Speaker');
  await page.fill('#speaker-email', 'test@example.com');
  await page.fill('#speaker-talk-title', 'Building Reliable Web Apps');
  await page.check('#speaker-is-gde');

  await expect(page.locator('#speaker-name')).toHaveValue('Test Speaker');
  await expect(page.locator('#speaker-email')).toHaveValue('test@example.com');
  await expect(page.locator('#speaker-talk-title')).toHaveValue('Building Reliable Web Apps');

  const submitButton = page.getByRole('button', { name: 'Submit proposal' });
  await expect(submitButton).toBeEnabled({ timeout: 10000 });
  await submitButton.click();

  await expect(page.getByText('Proposal submitted for Test Speaker.')).toBeVisible();
});
