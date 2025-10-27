export type CheckStatus = 'C' | 'NC' | 'NA';

export interface Inspection {
  id: string;
  date: string;
  startTime: string;
  startKm: string;
  endTime: string;
  endKm: string;
  inspector: string;
  matricula: string;
  tag: string;
  checks: { [key: string]: CheckStatus };
}

export interface Observation {
  id: string;
  dateTime: string;
  description: string;
  company: string;
  employee: string;
}

export interface Photo {
  id: string;
  file: File;
  preview: string;
  description: string;
}