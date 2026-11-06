import { expect, type Page } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: ReturnType<Page['locator']>;
  private readonly passwordInput: ReturnType<Page['locator']>;
  private readonly loginButton: ReturnType<Page['locator']>;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#txt-username');
    this.passwordInput = page.locator('#txt-password');
    this.loginButton = page.locator('#btn-login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Make Appointment' }),
    ).toBeVisible();
  }
}
