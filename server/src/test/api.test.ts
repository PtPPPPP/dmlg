import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('API Tests', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.timestamp).toBeDefined();
    });
  });

  describe('GET /api/athletes', () => {
    it('should return paginated athletes', async () => {
      const res = await request(app).get('/api/athletes?limit=2');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.limit).toBe(2);
      expect(res.body.pagination.total).toBeGreaterThan(0);
    });

    it('should support search query', async () => {
      const res = await request(app).get('/api/athletes?q=lyles');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].englishName.toLowerCase()).toContain('lyles');
    });

    it('should support gender filter', async () => {
      const res = await request(app).get('/api/athletes?gender=female&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.data.every((a: any) => a.gender === 'female')).toBe(true);
    });
  });

  describe('GET /api/athletes/:id', () => {
    it('should return athlete details', async () => {
      const res = await request(app).get('/api/athletes/noah-lyles');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('noah-lyles');
      expect(res.body.data.name).toBeDefined();
      expect(res.body.data.recentResults).toBeDefined();
    });

    it('should return 404 for non-existent athlete', async () => {
      const res = await request(app).get('/api/athletes/non-existent-athlete');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/athletes/countries', () => {
    it('should return list of countries', async () => {
      const res = await request(app).get('/api/athletes/countries');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/results', () => {
    it('should return paginated results', async () => {
      const res = await request(app).get('/api/results?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination).toBeDefined();
    });

    it('should support athleteId filter', async () => {
      const res = await request(app).get('/api/results?athleteId=noah-lyles');
      expect(res.status).toBe(200);
      expect(res.body.data.every((r: any) => r.athleteId === 'noah-lyles')).toBe(true);
    });

    it('should support verified filter', async () => {
      const res = await request(app).get('/api/results?verified=verified&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.data.every((r: any) => r.source.verified === 'verified')).toBe(true);
    });

    it('should sort by date descending by default', async () => {
      const res = await request(app).get('/api/results?limit=5');
      expect(res.status).toBe(200);
      const dates = res.body.data.map((r: any) => new Date(r.date).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    });
  });

  describe('GET /api/events', () => {
    it('should return list of events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should support category filter', async () => {
      const res = await request(app).get('/api/events?category=sprints');
      expect(res.status).toBe(200);
      expect(res.body.data.every((e: any) => e.category === 'sprints')).toBe(true);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return event details', async () => {
      const res = await request(app).get('/api/events/100m');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('100m');
      expect(res.body.data.name).toBeDefined();
    });

    it('should return 404 for non-existent event', async () => {
      const res = await request(app).get('/api/events/non-existent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return proper error format', async () => {
      const res = await request(app).get('/api/athletes/non-existent');
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error');
      expect(res.body.success).toBe(false);
      expect(res.body.data).toBeNull();
    });
  });
});
