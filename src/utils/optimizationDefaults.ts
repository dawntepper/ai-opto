import { EntryType, Sport } from '../types';

export const getDefaultMaxOwnership = (entryType: EntryType, sport?: Sport) => {
  if (!sport) return 30;
  
  switch (entryType) {
    case 'single':
      return 30;
    case '3-max':
      return 35;
    case '20-max':
      return 25;
    default:
      return 30;
  }
};

export const getDefaultCorrelation = (entryType: EntryType, sport?: Sport) => {
  if (!sport) return 'medium';
  
  switch (entryType) {
    case 'single':
      return 'medium';
    case '3-max':
      return 'strong';
    case '20-max':
      return 'strong';
    default:
      return 'medium';
  }
};

export const getDefaultLineupCount = (entryType: EntryType) => {
  switch (entryType) {
    case 'single':
      return 1;
    case '3-max':
      return 3;
    case '20-max':
      return 20;
    default:
      return 1;
  }
};

export const getMaxLineups = (entryType: EntryType) => {
  switch (entryType) {
    case 'single':
      return 1;
    case '3-max':
      return 3;
    case '20-max':
      return 20;
    default:
      return 1;
  }
};
