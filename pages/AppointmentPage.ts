import { expect, type Page } from '@playwright/test';
import type { AppointmentData } from '../test-data/appointmentData';

export class AppointmentPage {
  private readonly facilityDropdown: ReturnType<Page['locator']>;
  private readonly hospitalReadmissionCheckbox: ReturnType<Page['locator']>;
  private readonly visitDateInput: ReturnType<Page['locator']>;
  private readonly commentInput: ReturnType<Page['locator']>;
  private readonly bookAppointmentButton: ReturnType<Page['locator']>;

  constructor(private readonly page: Page) {
    this.facilityDropdown = page.locator('#combo_facility');
    this.hospitalReadmissionCheckbox = page.locator(
      '#chk_hospotal_readmission',
    );
    this.visitDateInput = page.locator('#txt_visit_date');
    this.commentInput = page.locator('#txt_comment');
    this.bookAppointmentButton = page.locator('#btn-book-appointment');
  }

  async selectFacility(facility: AppointmentData['facility']): Promise<void> {
    await this.facilityDropdown.selectOption({ label: facility });
  }

  async selectHealthcareProgram(
    program: AppointmentData['healthcareProgram'],
  ): Promise<void> {
    await this.page.locator(`input[name="programs"][value="${program}"]`).check();
  }

  async setHospitalReadmission(shouldReadmit: boolean): Promise<void> {
    if (shouldReadmit) {
      await this.hospitalReadmissionCheckbox.check();
    } else {
      await this.hospitalReadmissionCheckbox.uncheck();
    }
  }

  async setVisitDate(date: string): Promise<void> {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
    if (!match) {
      throw new Error(`Invalid visit date "${date}". Expected dd/mm/yyyy.`);
    }

    const [, dayText, monthText, yearText] = match;
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    const targetDate = new Date(year, month - 1, day);
    if (
      targetDate.getFullYear() !== year ||
      targetDate.getMonth() !== month - 1 ||
      targetDate.getDate() !== day
    ) {
      throw new Error(`Invalid visit date "${date}".`);
    }

    await this.visitDateInput.click();

    const monthHeader = this.page.locator(
      '.datepicker-days th.datepicker-switch',
    );
    const targetMonth = new Date(year, month - 1, 1);
    while (true) {
      const displayedMonth = new Date(`${await monthHeader.innerText()} 1`);
      if (displayedMonth.getTime() === targetMonth.getTime()) {
        break;
      }

      const direction =
        displayedMonth.getTime() < targetMonth.getTime() ? 'next' : 'prev';
      await this.page.locator(`.datepicker-days th.${direction}`).click();
    }

    await this.page
      .locator('.datepicker-days td.day:not(.old):not(.new)')
      .getByText(String(day), { exact: true })
      .click();
  }

  async setComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async makeAppointment(data: AppointmentData): Promise<void> {
    await this.selectFacility(data.facility);
    await this.setHospitalReadmission(data.hospitalReadmission);
    await this.selectHealthcareProgram(data.healthcareProgram);
    await this.setVisitDate(data.visitDate);
    await this.setComment(data.comment);
    await this.bookAppointmentButton.click();
  }

  async verifyAppointmentConfirmation(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Appointment Confirmation' }),
    ).toBeVisible();
  }

  async verifyAppointmentDetails(data: AppointmentData): Promise<void> {
    await expect(this.page.locator('#facility')).toHaveText(data.facility);
    await expect(this.page.locator('#hospital_readmission')).toHaveText(
      data.hospitalReadmission ? 'Yes' : 'No',
    );
    await expect(this.page.locator('#program')).toHaveText(
      data.healthcareProgram,
    );
    await expect(this.page.locator('#visit_date')).toHaveText(data.visitDate);
    await expect(this.page.locator('#comment')).toHaveText(data.comment);
  }
}
