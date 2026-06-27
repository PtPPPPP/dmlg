import { describe, it, expect } from 'vitest'
import {
  sortResultsByDateDesc,
  getResultsByAthleteId,
  getLatestResultByAthleteId,
  getLatestResultsByAthleteId,
  getAthleteDisplayLatestResult,
  getResultsByEvent,
  getResultsByCompetition,
  getVerifiedResults,
  getPendingResults,
  getResultsFreshnessStatus,
} from '../domain/athletics/resultUtils'
import type { CompetitionResult, DataMeta, Athlete } from '../domain/athletics/types'

describe('resultUtils', () => {
  const mockResults: CompetitionResult[] = [
    {
      id: '1',
      athleteId: 'athlete-1',
      athleteName: '苏炳添',
      athleteEnglishName: 'Su Bingtian',
      event: '100m',
      eventCategory: 'sprints',
      competitionName: 'Diamond League Shanghai',
      competitionSlug: 'diamond-league-shanghai',
      date: '2024-05-18',
      mark: '10.05',
      place: 1,
      wind: '+0.3',
      source: {
        sourceName: 'Diamond League',
        sourceUrl: 'https://example.com',
        sourceType: 'diamond-league',
        updatedAt: '2024-05-18',
        verified: 'verified',
      },
    },
    {
      id: '2',
      athleteId: 'athlete-1',
      athleteName: '苏炳添',
      athleteEnglishName: 'Su Bingtian',
      event: '100m',
      eventCategory: 'sprints',
      competitionName: 'Diamond League Eugene',
      competitionSlug: 'diamond-league-eugene',
      date: '2024-06-15',
      mark: '9.98',
      place: 2,
      wind: '+0.5',
      source: {
        sourceName: 'Diamond League',
        sourceUrl: 'https://example.com',
        sourceType: 'diamond-league',
        updatedAt: '2024-06-15',
        verified: 'pending',
      },
    },
    {
      id: '3',
      athleteId: 'athlete-2',
      athleteName: '谢震业',
      athleteEnglishName: 'Xie Zhenye',
      event: '200m',
      eventCategory: 'sprints',
      competitionName: 'Diamond League Shanghai',
      competitionSlug: 'diamond-league-shanghai',
      date: '2024-05-18',
      mark: '20.15',
      place: 3,
      wind: '+0.2',
      source: {
        sourceName: 'Diamond League',
        sourceUrl: 'https://example.com',
        sourceType: 'diamond-league',
        updatedAt: '2024-05-18',
        verified: 'verified',
      },
    },
  ]

  describe('sortResultsByDateDesc', () => {
    it('should sort results by date in descending order', () => {
      const sorted = sortResultsByDateDesc(mockResults)
      expect(sorted[0].date).toBe('2024-06-15')
      expect(sorted[1].date).toBe('2024-05-18')
      expect(sorted[2].date).toBe('2024-05-18')
    })

    it('should not modify the original array', () => {
      const original = [...mockResults]
      sortResultsByDateDesc(mockResults)
      expect(mockResults).toEqual(original)
    })
  })

  describe('getResultsByAthleteId', () => {
    it('should return results for a specific athlete', () => {
      const results = getResultsByAthleteId(mockResults, 'athlete-1')
      expect(results).toHaveLength(2)
      expect(results.every(r => r.athleteId === 'athlete-1')).toBe(true)
    })

    it('should return empty array for non-existent athlete', () => {
      const results = getResultsByAthleteId(mockResults, 'non-existent')
      expect(results).toHaveLength(0)
    })
  })

  describe('getResultsByEvent', () => {
    it('should return results for a specific event', () => {
      const results = getResultsByEvent(mockResults, '100m')
      expect(results).toHaveLength(2)
      expect(results.every(r => r.event === '100m')).toBe(true)
    })

    it('should be case insensitive', () => {
      const results = getResultsByEvent(mockResults, '100M')
      expect(results).toHaveLength(2)
    })
  })

  describe('getLatestResultByAthleteId', () => {
    it('should return the most recent result for an athlete', () => {
      const latest = getLatestResultByAthleteId(mockResults, 'athlete-1')
      expect(latest).toBeDefined()
      expect(latest!.date).toBe('2024-06-15')
      expect(latest!.athleteId).toBe('athlete-1')
    })

    it('should return undefined for non-existent athlete', () => {
      const latest = getLatestResultByAthleteId(mockResults, 'non-existent')
      expect(latest).toBeUndefined()
    })
  })

  describe('getLatestResultsByAthleteId', () => {
    it('should return limited results for an athlete', () => {
      const results = getLatestResultsByAthleteId(mockResults, 'athlete-1', 1)
      expect(results).toHaveLength(1)
      expect(results[0].date).toBe('2024-06-15')
    })

    it('should return all results if limit is higher than available', () => {
      const results = getLatestResultsByAthleteId(mockResults, 'athlete-1', 10)
      expect(results).toHaveLength(2)
    })
  })

  describe('getAthleteDisplayLatestResult', () => {
    it('should return the latest result for display', () => {
      const athlete: Pick<Athlete, 'id' | 'englishName' | 'name'> = {
        id: 'athlete-1',
        name: '苏炳添',
        englishName: 'Su Bingtian',
      }
      const result = getAthleteDisplayLatestResult(athlete, mockResults)
      expect(result).toBeDefined()
      expect(result!.date).toBe('2024-06-15')
    })
  })

  describe('getResultsByCompetition', () => {
    it('should return results for a specific competition', () => {
      const results = getResultsByCompetition(mockResults, 'diamond-league-shanghai')
      expect(results).toHaveLength(2)
      expect(results.every(r => r.competitionSlug === 'diamond-league-shanghai')).toBe(true)
    })
  })

  describe('getVerifiedResults', () => {
    it('should return only verified results', () => {
      const verified = getVerifiedResults(mockResults)
      expect(verified).toHaveLength(2)
      expect(verified.every(r => r.source.verified === 'verified')).toBe(true)
    })
  })

  describe('getPendingResults', () => {
    it('should return only pending results', () => {
      const pending = getPendingResults(mockResults)
      expect(pending).toHaveLength(1)
      expect(pending[0].source.verified).toBe('pending')
    })
  })

  describe('getResultsFreshnessStatus', () => {
    it('should return fresh for recent data', () => {
      const dataMeta: DataMeta = {
        lastAutoSync: new Date().toISOString(),
        lastManualUpdate: new Date().toISOString(),
        dataPolicy: 'test',
        recommendedSources: [],
      }
      expect(getResultsFreshnessStatus(dataMeta)).toBe('fresh')
    })

    it('should return stale for old data', () => {
      const oldDate = new Date()
      oldDate.setDate(oldDate.getDate() - 90)
      const dataMeta: DataMeta = {
        lastAutoSync: oldDate.toISOString(),
        lastManualUpdate: oldDate.toISOString(),
        dataPolicy: 'test',
        recommendedSources: [],
      }
      expect(getResultsFreshnessStatus(dataMeta)).toBe('stale')
    })

    it('should return aging for moderately old data', () => {
      const agingDate = new Date()
      agingDate.setDate(agingDate.getDate() - 45)
      const dataMeta: DataMeta = {
        lastAutoSync: agingDate.toISOString(),
        lastManualUpdate: agingDate.toISOString(),
        dataPolicy: 'test',
        recommendedSources: [],
      }
      expect(getResultsFreshnessStatus(dataMeta)).toBe('aging')
    })
  })
})
