import { test } from '@playwright/test';
import { AppointmentPage } from '../pages/AppointmentPage';
import { LoginPage } from '../pages/LoginPage';
import { appointmentData } from '../test-data/appointmentData';

const username = 'John Doe';
const password = 'ThisIsNotAPassword';

test.describe('Make Appointment', () => {
  for (const data of appointmentData) {
    test(`${data.testId} - Make Appointment`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Make Appointment' }).click();

      const loginPage = new LoginPage(page);
      await loginPage.login(username, password);
      await loginPage.verifyLoginSuccess();

      const appointmentPage = new AppointmentPage(page);
      await appointmentPage.makeAppointment(data);
      await appointmentPage.verifyAppointmentConfirmation();
      await appointmentPage.verifyAppointmentDetails(data);
    });
  }
});
