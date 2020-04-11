const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { app } = require('../server');
const { users } = require('../services');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../services');

const mockSignUpData = {
    email: 'mock@test.com',
    password: 'mock-password',
    first_name: 'Mock',
    last_name: 'Jest',
    mobile: '1234334324',
    type: 'teacher',
};

const mockLoginData = {
    email: 'mock@mock.com',
    password: 'pasword123',
};

describe('server', () => {
    describe('#/api/status', () => {
        it('should return 200 from the status endpoint', (done) => {
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

        it('should respond with a 500 error when bcrypt fails to hash the password', (done) => {
            bcrypt.hash = jest
                .fn()
                .mockRejectedValue('Some mock bcrypt error hash error');

            request(app)
                .post('/api/create-account')
                .send(mockSignUpData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

        it('should respond with a 500 error when user service fails to create the user', (done) => {
            bcrypt.hash = jest.fn().mockResolvedValue('Successful mock hash');
            users.createUser = jest
                .fn()
                .mockRejectedValue('Some mock user service error');

            request(app)
                .post('/api/create-account')
                .send(mockSignUpData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

        it('should respond with a 200 success when bcrypt successfully hashes password and user service creates the user', (done) => {
            bcrypt.hash = jest.fn().mockResolvedValue('Successful mock hash');
            users.createUser = jest
                .fn()
                .mockResolvedValue('Successfully mocked creation of user!');

            request(app)
                .post('/api/create-account')
                .send(mockSignUpData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('#/api/login', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should respond with a 500 error when no user is found', (done) => {
            users.findUser = jest.fn().mockRejectedValue('User not found');
            request(app)
                .post('/api/login')
                .send(mockLoginData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

        it('should respond with a 400 error if the hashed password does not equal the entered password', (done) => {
            users.findUser = jest.fn().mockResolvedValue(['email-address']);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            request(app)
                .post('/api/login')
                .send(mockLoginData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });

        it('should respond with a 200 success when the user is found and the password matches', (done) => {
            users.findUser = jest.fn().mockResolvedValue(['email-address']);
            bcrypt.compare = jest.fn().mockResolvedValue('Passwords Match');
            jwt.sign = jest.fn().mockResolvedValue('token');

            request(app)
                .post('/api/login')
                .send(mockLoginData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
