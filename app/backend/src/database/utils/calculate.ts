import { IMatches } from '../../Interfaces/IMatches';

export function calculateTotalGames(teamId: number, matches: IMatches[]): number {
  return matches.filter(
    (match) => match.homeTeamId === teamId || match.awayTeamId === teamId,
  ).length;
}

export function calculateTotalPoints(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if (match.homeTeamId === teamId) {
      if (match.homeTeamGoals > match.awayTeamGoals) return acc + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
    }
    if (match.awayTeamId === teamId) {
      if (match.awayTeamGoals > match.homeTeamGoals) return acc + 3;
      if (match.awayTeamGoals === match.homeTeamGoals) return acc + 1;
    }
    return acc;
  }, 0);
}

export function calculateTotalVictories(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if (match.homeTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) return acc + 1;
    if (match.awayTeamId === teamId && match.awayTeamGoals > match.homeTeamGoals) return acc + 1;
    return acc;
  }, 0);
}

export function calculateTotalDraws(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if ((match.homeTeamId === teamId || match.awayTeamId === teamId)
      && match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
    return acc;
  }, 0);
}

export function calculateTotalLosses(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if ((match.homeTeamId === teamId
      && match.homeTeamGoals < match.awayTeamGoals)
      || (match.awayTeamId === teamId && match.awayTeamGoals < match.homeTeamGoals)) return acc + 1;
    return acc;
  }, 0);
}

export function calculateGoalsFavor(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if (match.homeTeamId === teamId) return acc + match.homeTeamGoals;
    if (match.awayTeamId === teamId) return acc + match.awayTeamGoals;
    return acc;
  }, 0);
}

export function calculateGoalsOwn(teamId: number, matches: IMatches[]): number {
  return matches.reduce((acc, match) => {
    if (match.homeTeamId === teamId) return acc + match.awayTeamGoals;
    if (match.awayTeamId === teamId) return acc + match.homeTeamGoals;
    return acc;
  }, 0);
}
