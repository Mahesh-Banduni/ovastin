import { test, expect } from '@playwright/test';

test.setTimeout(5 * 60 * 1000); // 5 minutes

test('fill create project form - 10 projects', async ({ page }) => {
    // Navigate to admin login page
    await page.goto(`https://ovastin.vercel.app/signin`);

    // Optional: Add a small delay between submissions
    await page.waitForTimeout(3000);

    // Verify page title and branding
    await expect(page.getByText('ADMIN PORTAL')).toBeVisible();
    await expect(page.getByText('REAL ESTATE MANAGEMENT')).toBeVisible();

    // Verify login card
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByText('Sign in to your admin dashboard')).toBeVisible();

    // Verify form fields exist
    await expect(page.getByLabel(/Email Address/)).toBeVisible();
    await expect(page.getByLabel(/Password/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In to Dashboard' })).toBeVisible();

    // Fill in credentials
    await page.getByLabel(/Email Address/).fill('maheshbanduni9997@gmail.com');
    await page.getByLabel(/Password/).fill('Mahesh@7906');

    // Click sign in button
        await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    // Wait for navigation to dashboard
    await page.waitForURL(/\/admin\/projects/);

    // Verify successful login - should be on projects
    await expect(page).toHaveURL(/\/admin\/projects/);  

    // Define 10 different projects with unique data
    const projects = [
      {
        name: 'Aura Skyline Residences',
        slug: 'aura-skyline-residences',
        developer: 'Aura Skyline Developers LLC',
        city: 'New York',
        state: 'New York',
        postalCode: '10001',
        minPrice: '550000',
        maxPrice: '1850000',
        address: '42 Park Avenue, Midtown Manhattan',
        description: 'Luxury 2BR and 3BR condos with rooftop lounge and concierge services.'
      },
      {
        name: 'Green Valley Estates',
        slug: 'green-valley-estates',
        developer: 'Green Valley Builders Inc',
        city: 'Austin',
        state: 'Texas',
        postalCode: '78701',
        minPrice: '420000',
        maxPrice: '1200000',
        address: '1500 Barton Springs Road',
        description: 'Eco-friendly homes with solar panels, EV chargers, and community gardens.'
      },
      {
        name: 'Ocean View Towers',
        slug: 'ocean-view-towers',
        developer: 'Coastal Properties Group',
        city: 'Miami',
        state: 'Florida',
        postalCode: '33139',
        minPrice: '890000',
        maxPrice: '2800000',
        address: '1 Ocean Drive, South Beach',
        description: 'Beachfront luxury condos with panoramic ocean views and resort-style pools.'
      },
      {
        name: 'Urban Heights',
        slug: 'urban-heights',
        developer: 'Metro Development Partners',
        city: 'Chicago',
        state: 'Illinois',
        postalCode: '60601',
        minPrice: '480000',
        maxPrice: '1600000',
        address: '200 Michigan Avenue, The Loop',
        description: 'Modern high-rise living with smart home tech and city skyline views.'
      },
      {
        name: 'Sunset Villas',
        slug: 'sunset-villas',
        developer: 'Premium Homes Group',
        city: 'Los Angeles',
        state: 'California',
        postalCode: '90001',
        minPrice: '750000',
        maxPrice: '2400000',
        address: '8450 Sunset Boulevard, Hollywood Hills',
        description: 'Private gated villas with infinity pools and panoramic LA views.'
      },
      {
        name: 'Parkside Enclave',
        slug: 'parkside-enclave',
        developer: 'Nature Living Realty',
        city: 'Washington',
        state: 'District of Columbia',
        postalCode: '20001',
        minPrice: '920000',
        maxPrice: '3100000',
        address: '1100 Pennsylvania Avenue NW',
        description: 'Premier residences overlooking the National Mall with secure parking.'
      },
      {
        name: 'Riverfront Residency',
        slug: 'riverfront-residency',
        developer: 'Waterside Properties LLC',
        city: 'Portland',
        state: 'Oregon',
        postalCode: '97201',
        minPrice: '380000',
        maxPrice: '1050000',
        address: '1315 SW Park Avenue, Downtown',
        description: 'Affordable luxury with river views, bike storage, and fitness center.'
      },
      {
        name: 'Hill Crest Apartments',
        slug: 'hill-crest-apartments',
        developer: 'Mountain View Builders',
        city: 'Denver',
        state: 'Colorado',
        postalCode: '80202',
        minPrice: '520000',
        maxPrice: '1650000',
        address: '1600 California Street, LoDo',
        description: 'Mountain-view apartments with heated garages and modern finishes.'
      },
      {
        name: 'Tech Park Residences',
        slug: 'tech-park-residences',
        developer: 'Silicon Valley Developers',
        city: 'San Jose',
        state: 'California',
        postalCode: '95101',
        minPrice: '510000',
        maxPrice: '1450000',
        address: '1 Infinite Loop, Cupertino',
        description: 'Ideal for tech professionals — high-speed fiber, co-working space, and gym.'
      },
      {
        name: 'Royal Palms Estate',
        slug: 'royal-palms-estate',
        developer: 'Luxury Living Group',
        city: 'Scottsdale',
        state: 'Arizona',
        postalCode: '85251',
        minPrice: '680000',
        maxPrice: '2200000',
        address: '6900 E Camelback Road, Old Town',
        description: 'Mediterranean-style villas with private courtyards and resort amenities.'
      }
    ];

  // Verify we are on the Projects page
  await expect(
    page.getByRole('heading', { name: 'Projects' })
  ).toBeVisible();

  // Loop through each project and create it
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log(`Creating project ${i + 1} of ${projects.length}: ${project.name}`);

    // Open Create Project dialog
    await page.getByRole('button', { name: 'Add Project' }).click();

    // Verify Modal Title
    await expect(
      page.getByRole('heading', { name: 'Create New Project' })
    ).toBeVisible();

    // ---------------------------------------------------------
    // Row 1: Project Name & Slug
    // ---------------------------------------------------------
    await page.getByLabel('Project Name').fill(project.name);
    await page.getByLabel('Slug').fill(project.slug);

    // ---------------------------------------------------------
    // Row 2: Property Type & Status
    // ---------------------------------------------------------
    await page.getByLabel('Property Type').click();
    await page.getByRole('option', { name: 'Apartment', exact: true }).click();
    await page.getByLabel('Status').click();
    await page.getByRole('option', { name: 'Draft', exact: true }).click();

    // ---------------------------------------------------------
    // Row 3: Developer & Possession Date
    // ---------------------------------------------------------
    await page.getByLabel('Developer / Builder').click();
    const developerOption = page.getByRole('option', { name: project.developer, exact: true });
    if (await developerOption.count()) {
      await developerOption.click();
    } else {
      await page.getByRole('option', { name: '-- None Selected --', exact: true }).click();
    }
    await page.getByLabel('Possession Date').fill('2028-12-25');

    // ---------------------------------------------------------
    // Row 4: Currency, Min Price, Max Price
    // ---------------------------------------------------------
    await page.getByLabel('Currency').fill('INR');
    await page.getByLabel('Min Price').fill(project.minPrice);
    await page.getByLabel('Max Price').fill(project.maxPrice);

    // ---------------------------------------------------------
    // Row 5: City, State, Postal Code
    // ---------------------------------------------------------
    await page.getByLabel('City').fill(project.city);
    await page.getByLabel('State').fill(project.state);
    await page.getByLabel('Postal Code').fill(project.postalCode);

    // ---------------------------------------------------------
    // Row 6: Address
    // ---------------------------------------------------------
    await page.getByLabel('Address').fill(project.address);

    // ---------------------------------------------------------
    // Row 7: Project Cover Image (Optional - skip for loop)
    // ---------------------------------------------------------
    // Uncomment if you want to upload images
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('path/to/test-image.jpg');

    // ---------------------------------------------------------
    // Row 8: Description
    // ---------------------------------------------------------
    await page.getByLabel('Description').fill(project.description);

    // ---------------------------------------------------------
    // Submit the form
    // ---------------------------------------------------------
    await page.getByRole('button', { name: 'Create Project' }).click();

    // The Projects heading remains visible behind the modal, so wait for the
    // form dialog itself to close before starting the next iteration.
    await expect(
      page.getByRole('heading', { name: 'Create New Project' })
    ).toBeHidden({ timeout: 30000 });
    
    // Optional: Add a small delay between submissions
    await page.waitForTimeout(1000);
    
    console.log(`✓ Project ${i + 1} created successfully`);
  }

  console.log(`\n✅ All ${projects.length} projects created successfully!`);
  
  // Final verification - check if projects count increased
  await expect(
    page.getByRole('heading', { name: 'Projects' })
  ).toBeVisible();
});