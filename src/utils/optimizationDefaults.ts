import { EntryType } from '../types';

export function getDefaultMaxOwnership(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 35;
    case '3-max': return 45;
    case '20-max': return 55;
  }
}

export function getDefaultCorrelation(entryType: EntryType): 'weak' | 'medium' | 'strong' {
  switch (entryType) {
    case 'single': return 'medium';
    case '3-max': return 'medium';
    case '20-max': return 'strong';
  }
}

export function getDefaultLineupCount(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 1;
    case '3-max': return 3;
    case '20-max': return 20;
  }
}

export function getMaxLineups(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 1;
    case '3-max': return 3;
    case '20-max': return 20;
  }
}