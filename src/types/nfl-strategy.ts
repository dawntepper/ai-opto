import { EntryType } from './index';

export interface NFLStrategy {
  type: EntryType;
  title: string;
  keyPrinciples: string[];
  ownershipRules: string[];
  stackingRules: string[];
  gameEnvironment: string[];
  salaryDistribution: string[];
  positionRules: string[];
}

export const nflStrategies: Record<EntryType, NFLStrategy> = {
  'single': {
    type: 'single',
    title: "Single-Entry NFL Strategy",
    keyPrinciples: [
      "Focus on high-floor, consistent producers",
      "QB + primary receiver stack",
      "Game correlation optional",
      "Weather impacts prioritized"
    ],
    ownershipRules: [
      "Can use more chalk plays",
      "Mix of popular and contrarian plays",
      "Maximum 40% exposure allowed",
      "Consider slate-specific narratives"
    ],
    stackingRules: [
      "QB + primary receiver required",
      "Optional bring-back from opposing team",
      "Consider RB + DEF correlation in positive game scripts",
      "Avoid negative correlations (opposing RBs)"
    ],
    gameEnvironment: [
      "Target games with totals 47+",
      "Consider weather impacts",
      "Leverage home/away splits",
      "Focus on positive game scripts"
    ],
    salaryDistribution: [
      "Full salary usage acceptable",
      "Balanced roster construction",
      "Target high-volume opportunities",
      "Consider salary-based ownership"
    ],
    positionRules: [
      "QB: High-floor veterans preferred",
      "RB: Focus on volume and game script",
      "WR: Target share > 20%",
      "TE: Red zone participation key",
      "DEF: Home favorites priority"
    ]
  },
  '3-max': {
    type: '3-max',
    title: "3-Max NFL Strategy",
    keyPrinciples: [
      "Mixed ownership approach",
      "At least one contrarian play per lineup",
      "Stack requirements flexible",
      "Weather considerations important"
    ],
    ownershipRules: [
      "Maximum 30% exposure to any player",
      "At least one sub-10% owned player",
      "Balance chalk and contrarian plays",
      "Leverage against popular stacks"
    ],
    stackingRules: [
      "QB + 1-2 pass catchers",
      "Optional bring-back",
      "Consider game script correlation",
      "RB + DEF stacks in favorable matchups"
    ],
    gameEnvironment: [
      "Minimum 2 different game environments",
      "Target high totals (48+)",
      "Consider spread impacts",
      "Weather adjustments"
    ],
    salaryDistribution: [
      "Leave $0-400 salary on table",
      "Mix of balanced and stars/scrubs",
      "Position-specific salary allocation",
      "Value plays in good spots"
    ],
    positionRules: [
      "QB: Mix of safe and upside plays",
      "RB: Game script correlation",
      "WR/TE: Stack combinations",
      "DEF: Leverage opportunities"
    ]
  },
  '20-max': {
    type: '20-max',
    title: "20-Max NFL Strategy",
    keyPrinciples: [
      "Diversified portfolio approach",
      "Multiple game environments",
      "Strategic ownership deviation",
      "Weather-based leverage"
    ],
    ownershipRules: [
      "Maximum 25% exposure to any non-QB",
      "Maximum 35% exposure to any QB stack",
      "At least one sub-5% owned player per lineup",
      "Strategic leverage points"
    ],
    stackingRules: [
      "QB + 2-3 pass catchers",
      "Bring-back from opposing team",
      "Game stacks based on Vegas totals",
      "Negative correlation rules"
    ],
    gameEnvironment: [
      "At least 3 different game environments",
      "High totals (50+) priority",
      "Spread-based correlation",
      "Weather impact analysis"
    ],
    salaryDistribution: [
      "Leave $200-700 salary on table",
      "Variable distribution strategy",
      "Salary-based ownership leverage",
      "Position-specific allocation"
    ],
    positionRules: [
      "QB: Mobile QBs for ceiling",
      "RB: Leverage opportunities",
      "WR: Stack diversity",
      "TE: Salary-based approach",
      "DEF: Contrarian opportunities"
    ]
  }
};