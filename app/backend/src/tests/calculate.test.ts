import * as chai from 'chai';
//@ts-ignore
import {
  calculateTotalGames,
  calculateTotalPoints,
  calculateTotalVictories,
  calculateTotalDraws,
  calculateTotalLosses,
  calculateGoalsFavor,
  calculateGoalsOwn,
 } from '../database/utils/calculate';
import { IMatches } from '../Interfaces/IMatches';

const { expect } = chai;

describe('Funções calculate:', () => {
  const matches: IMatches[] = [
    { id: 1, homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 2, awayTeamGoals: 1, inProgress: false },
    { id: 2, homeTeamId: 1, awayTeamId: 3, homeTeamGoals: 1, awayTeamGoals: 1, inProgress: false },
    { id: 3, homeTeamId: 2, awayTeamId: 1, homeTeamGoals: 0, awayTeamGoals: 3, inProgress: false },
  ];

  it('Verifica o cálculo de jogos totais', () => {
    const totalGames = calculateTotalGames(1, matches);
    expect(totalGames).to.equal(3);
  });

  it('Verifica o cálculo de pontos totais', () => {
    const totalPoints = calculateTotalPoints(1, matches);
    expect(totalPoints).to.equal(7); // 2 wins, 1 draw
  });

  it('Verifica a somatória de vitórias corretamente', () => {
    const totalVictories = calculateTotalVictories(1, matches);
    expect(totalVictories).to.equal(2);
  });

  it('Verifica o cálculo de empates totais', () => {
    const totalDraws = calculateTotalDraws(1, matches);
    expect(totalDraws).to.equal(1);
  });

  it('Verifica a quantidade de perdas totais', () => {
    const totalLosses = calculateTotalLosses(1, matches);
    expect(totalLosses).to.equal(0);
  });

  it('Verifica o cálculo total de gols a favor', () => {
    const goalsFavor = calculateGoalsFavor(1, matches);
    expect(goalsFavor).to.equal(6);
  });

  it('Verifica o total de gols tomados', () => {
    const goalsOwn = calculateGoalsOwn(1, matches);
    expect(goalsOwn).to.equal(2);
  });
});
