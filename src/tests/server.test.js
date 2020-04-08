const request = require('supertest');
const bcrypt = require('bcrypt');

const { app } = require('../server');
const { users } = require('../services');

jest.mock('bcrypt');
jest.mock('../services');

const mockData = {
	email: 'mock@test.com',
	password: 'mock-password',
	first_name: 'Mock',
	last_name: 'Jest',
	mobile: '1234334324',
	type: 'teacher',
};

describe('server', () => {
    describe('#/api/status', () => {
        it('should return 200 from the status endpoint', done => {
            request(app)
                .get('/api/status')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('#/api/create-account', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should respond with a 500 error when bcrypt fails to hash the password', done => {
            bcrypt.hash = jest.fn().mockRejectedValue('Some mock bcrypt error hash error');

            request(app)
                .post('/api/create-account')
                .send(mockData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done)
        });

        it('should respond with a 500 error when user service fails to create the user', done => {
            bcrypt.hash = jest.fn().mockResolvedValue('Successful mock hash');
            users.createUser = jest.fn().mockRejectedValue('Some mock user service error');

            request(app)
                .post('/api/create-account')
                .send(mockData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done)
        });

        it('should respond with a 200 success when bcrypt successfully hashes password and user service creates the user', done => {
            bcrypt.hash = jest.fn().mockResolvedValue('Successful mock hash');
            users.createUser = jest.fn().mockResolvedValue('Successfully mocked creation of user!');

            request(app)
                .post('/api/create-account')
                .send(mockData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done)
        });
    });

    describe('#/api/login', () => {
        // TODO: Add unit test coverage
    });
});
