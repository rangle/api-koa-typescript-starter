import supertest from 'supertest';
import { app } from '../../app';

const request = supertest.agent(app.listen());

// note: JWT token will expire on: 2025-10-15
const JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0Njk0ZjEzNy01ODE4LTQ5NjQtOGNhMC04NjdhNjdmZjg3M2IiLCJpYXQiOjE1MzU2NjMyMjMsImV4cCI6MTc2MDQ4NjQwMH0.e5QvpnNwxHqMYAiS0NRTPMcKYVQWPikBIzILO5MfBsk';

describe('Demo', () => {
  describe('GET /demo/foo-is-required', () => {
    it('should work if the parameter is present', () => {
      return request
        .get('/demo/foo-is-required')
        .query({ foo: 'abc' })
        .expect(200, 'It works!');
    });

    it('should result in a 400 is parameter is missing', () => {
      return request
        .get('/demo/foo-is-required')
        .expect(400, 'foo is required.');
    });
  });

  describe('GET /demo/foo-is-required-and-protected', () => {
    it('should work if authorized and the parameter is present', () => {
      return request
        .get('/demo/foo-is-required-and-protected')
        .query({ foo: 'abc' })
        .set('Authorization', `Bearer ${JWT_TOKEN}`)
        .expect(200, 'It works!');
    });

    it('should result in a 400 if parameter is missing', () => {
      return request
        .get('/demo/foo-is-required-and-protected')
        .set('Authorization', `Bearer ${JWT_TOKEN}`)
        .expect(400, 'foo is required.');
    });

    it('should result in a 401 if authorization token is missing', () => {
      return request
        .get('/demo/foo-is-required-and-protected')
        .query({ foo: 'abc' })
        .expect(401);
    });

    it('should result in a 401 if authorization token is invalid', () => {
      return request
        .get('/demo/foo-is-required-and-protected')
        .set('Authorization', `Bearer invalid_token`)
        .query({ foo: 'abc' })
        .expect(401);
    });
  });

  describe('GET /demo/foo-must-be-numeric', () => {
    it('should work if the parameter is valid', () => {
      return request
        .get('/demo/foo-must-be-numeric')
        .query({ foo: 123 })
        .expect(200, 'It works!');
    });

    it('should result in a 400 if the parameter is not numeric', () => {
      return request
        .get('/demo/foo-must-be-numeric')
        .query({ foo: 'abc' })
        .expect(400, 'foo is invalid.');
    });

    it('should result in a 400 if the parameter mixes numbers with letters', () => {
      return request
        .get('/demo/foo-must-be-numeric')
        .query({ foo: 'abc123' })
        .expect(400, 'foo is invalid.');
    });

    it('should result in a 400 if the parameter is missing', () => {
      return request
        .get('/demo/foo-must-be-numeric')
        .expect(400, 'foo is required.');
    });
  });

  describe('POST /demo/body-must-have-foo-with-bar', () => {
    it('should work if the body has foo with bar', () => {
      return request
        .post('/demo/body-must-have-foo-with-bar')
        .send({
          foo: {
            bar: 'abc'
          }
        })
        .expect(200, 'It works!');
    });

    it('should result in a 400 is foo container is missing', () => {
      return request
        .post('/demo/body-must-have-foo-with-bar')
        .send({})
        .expect(400, 'Bad request');
    });

    it('should result in a 400 is foo container does not have bar', () => {
      return request
        .post('/demo/body-must-have-foo-with-bar')
        .send({
          foo: {}
        })
        .expect(400, 'bar is required.');
    });
  });

  describe('GET /demo/error', () => {
    it('should result in 500 app error response', () => {
      return request
        .get('/demo/error')
        .expect(500, 'App Error (this is intentional)!');
    });
  });

  describe('GET /demo/error-without-message', () => {
    it('should result in 500 app error response', () => {
      return request.get('/demo/error-without-message').expect(500, '');
    });
  });
});
