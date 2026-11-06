import { getFutureDate } from '../utils/dateUtils';

export interface AppointmentData {
  testId: string;
  facility:
    | 'Tokyo CURA Healthcare Center'
    | 'Hongkong CURA Healthcare Center'
    | 'Seoul CURA Healthcare Center';
  hospitalReadmission: boolean;
  healthcareProgram: 'Medicaid' | 'Medicare' | 'None';
  visitDate: string;
  comment: string;
}

export const appointmentData: AppointmentData[] = [
  {
    testId: 'TC001',
    facility: 'Tokyo CURA Healthcare Center',
    hospitalReadmission: true,
    healthcareProgram: 'Medicaid',
    visitDate: getFutureDate(30),
    comment: 'Regular checkup',
  },
  {
    testId: 'TC002',
    facility: 'Hongkong CURA Healthcare Center',
    hospitalReadmission: false,
    healthcareProgram: 'Medicare',
    visitDate: getFutureDate(31),
    comment: 'Follow-up appointment',
  },
  {
    testId: 'TC003',
    facility: 'Seoul CURA Healthcare Center',
    hospitalReadmission: true,
    healthcareProgram: 'None',
    visitDate: getFutureDate(32),
    comment: 'General consultation',
  },
];
