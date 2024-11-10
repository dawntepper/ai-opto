import { EntryType } from '../types';

export function getDefaultMaxOwnership(entryType: EntryType, sport: 'nba' | 'nfl' = 'nba'): number {
  if (sport === 'nfl') {
    switch (entryType) {
      case 'single': return 40;
      case '3-max': return 30;
      case '20-max': return 25;
    }
  }
  
  // NBA defaults
  switch (entryType) {
    case 'single': return 30;
    case '3-max': return 35;
    case '20-max': return 25;
  }
}

export function getDefaultCorrelation(entryType: EntryType, sport: 'nba' | 'nfl' = 'nba'): 'weak' | 'medium' | 'strong' {
  if (sport === 'nfl') {
    switch (entryType) {
      case 'single': return 'medium';
      case '3-max': return 'strong';
      case '20-max': return 'strong';
    }
  }
  
  // NBA defaults
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