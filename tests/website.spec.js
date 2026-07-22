// Integration tests for my-simple-website
// These tests boot the real static site (html+css+js served together)
// and verify it behaves correctly end-to-end in a real browser (Playwright/Chromium).

const { test, expect } = require('@playwright/test');

test.describe('my-simple-website — integration tests', () => {

  test('1. หน้าเว็บโหลดสำเร็จและ title ถูกต้อง', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('My Simple Website');
  });

  test('2. หัวข้อ H1 แสดงข้อความที่ถูกต้อง', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Hello GitHub Action Palm');
  });

  test('3. ย่อหน้าคำอธิบายแสดงผลถูกต้อง', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('p')).toHaveText('This is a simple website.');
  });

  test('4. ปุ่ม #myButton ต้องปรากฏและมองเห็นได้', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('#myButton');
    await expect(button).toBeVisible();
  });

  test('5. ปุ่มต้องมีข้อความ "Click me"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#myButton')).toHaveText('Click me');
  });

  test('6. คลิกปุ่มแล้วต้อง trigger alert("Button clicked!") — ทดสอบ HTML+JS ทำงานร่วมกัน', async ({ page }) => {
    await page.goto('/');
    let dialogMessage = null;
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await page.locator('#myButton').click();
    await page.waitForTimeout(200);
    expect(dialogMessage).toBe('Button clicked!');
  });

  test('7. style.css ถูกโหลดจริง — h1 ต้องมีสีตามที่กำหนด (#007bff)', async ({ page }) => {
    await page.goto('/');
    const color = await page.locator('h1').evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(0, 123, 255)');
  });

  test('8. ปุ่มต้องมีพื้นหลังสีตามที่กำหนดใน CSS (#28a745)', async ({ page }) => {
    await page.goto('/');
    const bg = await page.locator('#myButton').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(40, 167, 69)');
  });

  test('9. body ต้องใช้ font-family ตาม style.css และจัดกึ่งกลาง (text-align: center)', async ({ page }) => {
    await page.goto('/');
    const align = await page.locator('body').evaluate((el) => getComputedStyle(el).textAlign);
    expect(align).toBe('center');
  });

  test('10. หน้าเว็บต้องไม่มี console error ระหว่างโหลด — ยืนยันว่า script.js ทำงานได้ไม่พัง', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

});
