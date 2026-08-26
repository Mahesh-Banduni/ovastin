import { test, expect, type Page } from '@playwright/test';

test.setTimeout(5 * 60 * 1000);

const BASE_URL = 'http://localhost:3000';

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function signIn(page: Page) {
  await page.goto(`${BASE_URL}/signin`);
  await page.waitForTimeout(3000);

  await expect(page.getByText('ADMIN PORTAL')).toBeVisible();
  await expect(page.getByText('REAL ESTATE MANAGEMENT')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel(/Email Address/).fill('maheshbanduni9997@gmail.com');
  await page.getByLabel(/Password/).fill('Mahesh@7906');
  await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

  await page.waitForURL(/\/admin\/projects/);
  await expect(page).toHaveURL(/\/admin\/projects/);
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test('submit create developer form', async ({ page }) => {
  const suffix = uniqueSuffix();
  const name = `Developer ${suffix}`;
  const slug = `developer-${suffix}`;

  await page.goto(`${BASE_URL}/admin/developers`);
  await expect(page.getByRole('heading', { name: 'Developers & Partners' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Developer' }).first().click();
  await expect(page.getByRole('heading', { name: 'Create New Developer' })).toBeVisible();

  await page.getByLabel('Developer Name').fill(name);
  await page.getByLabel('Slug').fill(slug);
  await page.getByLabel('Website').fill(`https://example.com/${slug}`);
  await page.getByLabel('Description').fill(`A test developer record for ${name}.`);

  await page.getByRole('button', { name: 'Create Developer' }).click();
  await expect(page.getByRole('heading', { name: 'Create New Developer' })).toBeHidden({ timeout: 30000 });
});

test('submit create service form', async ({ page }) => {
  const suffix = uniqueSuffix();
  const name = `Service ${suffix}`;
  const slug = `service-${suffix}`;

  await page.goto(`${BASE_URL}/admin/services`);
  await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Service' }).first().click();
  await expect(page.getByRole('heading', { name: 'Create New Service' })).toBeVisible();

  await page.getByLabel('Service Name').fill(name);
  await page.getByLabel('Slug').fill(slug);
  await page.getByLabel('Icon Name / Identifier').fill('Home');
  await page.getByLabel('Sort Order').fill('1');
  await page.getByLabel('Description').fill(`A test service record for ${name}.`);

  await page.getByRole('button', { name: 'Create Service' }).click();
  await expect(page.getByRole('heading', { name: 'Create New Service' })).toBeHidden({ timeout: 30000 });
});

test('submit create amenity form', async ({ page }) => {
  const suffix = uniqueSuffix();
  const name = `Amenity ${suffix}`;
  const slug = `amenity-${suffix}`;

  await page.goto(`${BASE_URL}/admin/amenities`);
  await expect(page.getByRole('heading', { name: 'Amenities' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Amenity' }).first().click();
  await expect(page.getByRole('heading', { name: 'Create New Amenity' })).toBeVisible();

  await page.getByLabel('Amenity Name').fill(name);
  await page.getByLabel('Slug').fill(slug);
  await page.getByLabel('Icon / Identifier').fill('Pool');
  await page.getByLabel('Description').fill(`A test amenity record for ${name}.`);

  await page.getByRole('button', { name: 'Create Amenity' }).click();
  await expect(page.getByRole('heading', { name: 'Create New Amenity' })).toBeHidden({ timeout: 30000 });
});

test('submit create award form', async ({ page }) => {
  const suffix = uniqueSuffix();
  const currentYear = new Date().getFullYear().toString();

  await page.goto(`${BASE_URL}/admin/awards`);
  await expect(page.getByRole('heading', { name: 'Awards & Recognitions' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Award' }).first().click();
  await expect(page.getByRole('heading', { name: 'Add New Award' })).toBeVisible();

  await page.getByLabel('Award Name / Title').fill(`Award ${suffix}`);
  await page.getByLabel('Year').fill(currentYear);
  await page.getByLabel('Sort Order').fill('1');
  await page.getByLabel('Description / Organization').fill(`Test award record ${suffix}.`);

  await page.getByRole('button', { name: 'Create Award' }).click();
  await expect(page.getByRole('heading', { name: 'Add New Award' })).toBeHidden({ timeout: 30000 });
});

test('submit profile update form without changing values', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/profile`);
  await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin Information' })).toBeVisible();

  const fullNameInput = page.getByLabel('Full Name');
  const emailInput = page.getByLabel('Email Address');

  await expect(fullNameInput).not.toHaveValue('');
  await expect(emailInput).not.toHaveValue('');

  const currentName = await fullNameInput.inputValue();
  const currentEmail = await emailInput.inputValue();

  await fullNameInput.fill(currentName);
  await emailInput.fill(currentEmail);
  await page.getByRole('button', { name: 'Save Profile Changes' }).click();

  await expect(page.getByText('Profile updated successfully!')).toBeVisible({ timeout: 30000 });
});
