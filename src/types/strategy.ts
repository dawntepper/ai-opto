import { EntryType } from './index';

export interface BaseStrategy {
  title: string;
  keyPrinciples: string[];
}

export interface SingleEntryStrategy extends BaseStrategy {
  type: 'single';
  ownershipManagement: string[];
  rosterConstruction: string[];
  gameSelection: string[];
  checklist: string[];
}

export interface ThreeMaxStrategy extends BaseStrategy {
  type: '3-max';
  ownershipStructure: string[];
  coreManagement: string[];
  gameSelection: string[];
  buildTypes: string[];
}

export interface TwentyMaxStrategy extends BaseStrategy {
  type: '20-max';
  portfolioManagement: string[];
  buildTypes: string[];
  advancedConcepts: string[];
  implementationTips: string[];
}

export type Strategy = SingleEntryStrategy | ThreeMaxStrategy | TwentyMaxStrategy;

export const strategies: Record<EntryType, Strategy> = {
  'single': {
    type: 'single',
    title: "Single-Entry Strategy",
    keyPrinciples: [
      "Balanced Approach: Mix of chalk and contrarian plays",
      "1-2 leverage plays maximum",
      "Target 2-3 correlated players",
      "One game stack maximum"
    ],
    ownershipManagement: [
      "Aim for 1-2 players under 10% ownership",
      "Can use 1-2 chalk plays (>25% owned)",
      "Overall lineup ownership under 100% cumulative"
    ],
    rosterConstruction: [
      "Use conventional builds (1-2 value plays)",
      "Target one spend-up spot (typically stud PG or C)",
      "Maintain flexibility for late swap",
      "Focus on minutes security"
    ],
    gameSelection: [
      "Target one primary game environment",
      "Use basic two-player stacks",
      "Avoid overly complicated correlation"
    ],
    checklist: [
      "Maximum two players from same team",
      "At least one sub-10% owned player",
      "No more than two sub-$4,000 players",
      "One player projected over 50 DK points",
      "Clear path to 350+ DK points"
    ]
  },
  '3-max': {
    type: '3-max',
    title: "3-Max Strategy",
    keyPrinciples: [
      "Each lineup should have 4+ different players",
      "Vary spend-up spots across lineups",
      "Different game stack targets",
      "Mix of chalk and contrarian approaches"
    ],
    ownershipStructure: [
      "Line 1: More balanced (80-120% cumulative)",
      "Line 2: More contrarian (60-100% cumulative)",
      "Line 3: Leverage-focused (<80% cumulative)"
    ],
    coreManagement: [
      "Maximum 3 players in all lineups",
      "Different captains/multiplier spots",
      "Vary correlation strategies"
    ],
    gameSelection: [
      "Primary stack in each lineup",
      "Mix of game environments",
      "Correlation variations"
    ],
    buildTypes: [
      "Balanced Build: 2-3 value plays, even salary distribution",
      "Stars & Scrubs: 2 studs + value, extreme salary distribution",
      "Game Stack Focus: Heavy game correlation, environment-based upside"
    ]
  },
  '20-max': {
    type: '20-max',
    title: "20-Max Strategy",
    keyPrinciples: [
      "Clear player exposure rules",
      "Systematic game stack approach",
      "Defined correlation rules",
      "Strategic ownership deviation"
    ],
    portfolioManagement: [
      "25% chalk builds",
      "50% balanced builds",
      "25% contrarian builds",
      "Maximum 40% exposure to any player"
    ],
    buildTypes: [
      "5 lineups: Traditional builds",
      "5 lineups: Game stacks",
      "5 lineups: Stars/Scrubs",
      "5 lineups: Contrarian builds"
    ],
    advancedConcepts: [
      "Strategic exposure to different ownership tiers",
      "If Player A, then Player B at >50%",
      "Predetermined swap rules",
      "Ownership adaptation",
      "News-based pivots"
    ],
    implementationTips: [
      "Core players (30-40% exposure)",
      "Secondary players (15-25% exposure)",
      "Peripheral players (5-15% exposure)",
      "Primary game stack in 30% of lineups",
      "Value play exposure caps"
    ]
  }
};