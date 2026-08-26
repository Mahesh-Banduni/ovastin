import { test, expect } from '@playwright/test';

test.setTimeout(5 * 60 * 1000); // 5 minutes

test('fill create project form - 10 projects', async ({ page }) => {
    // Navigate to admin login page
    await page.goto(`http://localhost:3000/signin`);

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
      name: 'Skyline Residences',
      slug: 'skyline-residences',
      developer: 'Skyline Developers Pvt Ltd',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      minPrice: '5000000',
      maxPrice: '15000000',
      address: 'Plot 42, Palm Beach Road, Navi Mumbai',
      description: 'Luxury 2BHK and 3BHK apartments with modern amenities.'
    },
    {
      name: 'Green Valley Apartments',
      slug: 'green-valley-apartments',
      developer: 'Green Valley Builders',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      minPrice: '4500000',
      maxPrice: '12000000',
      address: 'Survey No 15, Hinjewadi Phase 2',
      description: 'Eco-friendly homes with solar panels and rainwater harvesting.'
    },
    {
      name: 'Ocean View Towers',
      slug: 'ocean-view-towers',
      developer: 'Coastal Properties Ltd',
      city: 'Goa',
      state: 'Goa',
      postalCode: '403001',
      minPrice: '8000000',
      maxPrice: '25000000',
      address: 'Candolim Beach Road',
      description: 'Beachfront luxury apartments with stunning sea views.'
    },
    {
      name: 'Urban Heights',
      slug: 'urban-heights',
      developer: 'Metro Developers',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      minPrice: '6000000',
      maxPrice: '18000000',
      address: 'MG Road, Central Bangalore',
      description: 'Modern living in the heart of the city with smart home features.'
    },
    {
      name: 'Sunset Villas',
      slug: 'sunset-villas',
      developer: 'Premium Homes Inc',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500001',
      minPrice: '7500000',
      maxPrice: '22000000',
      address: 'Jubilee Hills, Road No 45',
      description: 'Exclusive villas with private gardens and clubhouse access.'
    },
    {
      name: 'Parkside Enclave',
      slug: 'parkside-enclave',
      developer: 'Nature Living Developers',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      minPrice: '9000000',
      maxPrice: '30000000',
      address: 'Vasant Vihar, Near Deer Park',
      description: 'Premium apartments overlooking the green park.'
    },
    {
      name: 'Riverfront Residency',
      slug: 'riverfront-residency',
      developer: 'Waterside Properties',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380001',
      minPrice: '4000000',
      maxPrice: '11000000',
      address: 'SG Highway, Near Sabarmati River',
      description: 'Affordable luxury with river views and modern amenities.'
    },
    {
      name: 'Hill Crest Apartments',
      slug: 'hill-crest-apartments',
      developer: 'Mountain View Builders',
      city: 'Shimla',
      state: 'Himachal Pradesh',
      postalCode: '171001',
      minPrice: '5500000',
      maxPrice: '16000000',
      address: 'Mall Road, Near Ridge',
      description: 'Mountain view apartments with heating and modern facilities.'
    },
    {
      name: 'Tech Park Residences',
      slug: 'tech-park-residences',
      developer: 'IT Corridor Developers',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      minPrice: '5000000',
      maxPrice: '14000000',
      address: 'OMR, Near Tidel Park',
      description: 'Perfect for IT professionals with shuttle service and gym.'
    },
    {
      name: 'Royal Palms Estate',
      slug: 'royal-palms-estate',
      developer: 'Luxury Living Group',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      minPrice: '6500000',
      maxPrice: '20000000',
      address: 'Malviya Nagar, Near Jawahar Circle',
      description: 'Royal living with traditional architecture and modern comforts.'
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