import { test, expect } from '@playwright/test';

test.setTimeout(5 * 60 * 1000); // 5 minutes

test('Delete all projects one by one', async ({ page }) => {
  // Navigate to admin login page
  await page.goto(`https://ovastin.vercel.app/signin`);

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

  // Verify successful login
  await expect(page).toHaveURL(/\/admin\/projects/);

  // Verify we are on the Projects page
  await expect(
    page.getByRole('heading', { name: 'Projects' })
  ).toBeVisible();
  
  await page.waitForTimeout(5000);
  
  // Function to get current project count
  const getProjectCount = async () => {
    const countText = await page.locator('text=/\\d+ total/').textContent();
    return parseInt(countText?.match(/\d+/)?.[0] || '0');
  };
  
  let totalProjects = await getProjectCount();
  console.log(`Total projects to delete: ${totalProjects}`);
  
  while (totalProjects > 0) {
    console.log(`Remaining projects: ${totalProjects}`);
    
    try {
      // Get the first project row
      const firstRow = page.locator('table tbody tr').first();
      
      // Get project name for logging
      const projectNameCell = firstRow.locator('td').first();
      const projectName = await projectNameCell.textContent();
      console.log(`Deleting project: ${projectName?.trim()}`);
      
      // Find the delete button within the first row ONLY
      // This avoids the strict mode violation
      const deleteBtn = firstRow.locator('button[title="Delete"]');
      
      // Check if delete button exists in the row
      if (await deleteBtn.isVisible({ timeout: 2000 })) {
        console.log('Found delete button in row, clicking...');
        await deleteBtn.click();
        
        // Handle confirmation dialog
        console.log('Handling confirmation dialog...');
        await page.waitForTimeout(1000);
        
        // Look for confirm delete button
        const confirmSelectors = [
          'button:has-text("Delete Project")',
          'button:has-text("Delete")',
          'button:has-text("Confirm")',
          'button:has-text("Yes")',
          'button:has-text("OK")',
          'button[title="Confirm"]',
          'button[aria-label="Confirm"]',
          'button:has-text("Proceed")',
        ];
        
        let confirmed = false;
        for (const selector of confirmSelectors) {
          const confirmBtn = page.locator(selector).first();
          if (await confirmBtn.isVisible({ timeout: 1000 })) {
            console.log(`Found confirm button with selector: ${selector}`);
            await confirmBtn.click();
            confirmed = true;
            break;
          }
        }
        
        if (confirmed) {
          console.log('Deletion confirmed, waiting...');
          await page.waitForTimeout(3000);
        } else {
          console.log('Could not find confirm button, pressing Enter');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(2000);
        }
        
        // Reload the page to get updated list
        await page.reload();
        await page.waitForTimeout(3000);
        
      } else {
        console.log('Delete button not found in row, trying alternative...');
        
        // Alternative: Click on project name to go to detail page
        await projectNameCell.click();
        await page.waitForTimeout(2000);
        
        // On detail page, find delete button
        const detailDeleteBtn = page.locator('button[title="Delete"]').first();
        
        if (await detailDeleteBtn.isVisible({ timeout: 2000 })) {
          console.log('Found delete button on detail page');
          await detailDeleteBtn.click();
          
          // Handle confirmation
          await page.waitForTimeout(1000);
          const confirmBtn = page.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
          if (await confirmBtn.isVisible({ timeout: 1000 })) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
          }
          
          // Wait for navigation back
          await page.waitForURL(/\/admin\/projects/, { timeout: 5000 });
          await page.waitForTimeout(2000);
        } else {
          console.log('Delete button not found on detail page, going back');
          await page.goBack();
          await page.waitForTimeout(1000);
          
          // Try clicking the delete button with nth(0) as fallback
          const fallbackBtn = page.locator('button[title="Delete"]').first();
          if (await fallbackBtn.isVisible({ timeout: 1000 })) {
            await fallbackBtn.click();
            const confirmBtn = page.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
            if (await confirmBtn.isVisible({ timeout: 1000 })) {
              await confirmBtn.click();
              await page.waitForTimeout(2000);
            }
          }
        }
        
        // Reload
        await page.reload();
        await page.waitForTimeout(3000);
      }
      
      // Get updated count
      totalProjects = await getProjectCount();
      
    } catch (error) {
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
      await page.reload();
      await page.waitForTimeout(3000);
      totalProjects = await getProjectCount();
      
      // Try clicking cancel if a dialog is open
      const cancelBtn = page.locator('button:has-text("Cancel")');
      if (await cancelBtn.isVisible({ timeout: 1000 })) {
        await cancelBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }
  
  // Final verification
  await page.reload();
  await page.waitForTimeout(2000);
  const finalCount = await getProjectCount();
  expect(finalCount).toBe(0);
  console.log('All projects deleted successfully!');
});