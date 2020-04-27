const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { app } = require('../server');
const { lessons, users } = require('../services');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../middleware/decode-auth', () => ({
    decodeToken: () => ({
        id: 12345,
    }),
}));
jest.mock('../twilio', () => ({
    getAccessToken: jest.fn().mockReturnValue({
        identity: '',
        addGrant: jest.fn(),
    }),
    getVideoGrant: jest.fn().mockReturnValue(''),
}));
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
    afterEach(() => {
        jest.resetAllMocks();
    });

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

    describe('#/api/lessons', () => {
        it('should respond with a 500 error when something went wrong fetching the type of user', (done) => {
            users.getUserTypeById = jest.fn().mockRejectedValue('mock-error');

            request(app)
                .get('/api/lessons')
                .expect(500)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).toEqual('Error fetching lessons');
                    if (err) return done(err);
                    done();
                });
        });

        describe('when user type is teacher', () => {
            beforeEach(() => {
                users.getUserTypeById = jest
                    .fn()
                    .mockResolvedValue([{ type: 'teacher' }]);
            });

            it('should respond with a 500 error when something went wrong fetching the lessons data for a user', (done) => {
                lessons.getTeacherLessonsByUserId = jest
                    .fn()
                    .mockRejectedValue('Mock error yo!');

                request(app)
                    .get('/api/lessons')
                    .expect(500)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        expect(res.body).toEqual('Error fetching lessons');
                        if (err) return done(err);
                        done();
                    });
            });

            it('should respond with a 200 and empty lesson data when user is not found', (done) => {
                const expectedResponse = [];

                lessons.getTeacherLessonsByUserId = jest
                    .fn()
                    .mockResolvedValue([]);

                request(app)
                    .get('/api/lessons')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        expect(res.body).toEqual(expectedResponse);
                        if (err) return done(err);
                        done();
                    });
            });

            it('should return 200 and lesson data when lessons are succesfully fetched for a user', (done) => {
                const mockUserId = 12345;
                const mockResponseBody = [
                    {
                        id: 1,
                        teacher_id: mockUserId,
                        class_id: 1,
                    },
                ];

                lessons.getTeacherLessonsByUserId = jest
                    .fn()
                    .mockResolvedValue(mockResponseBody);

                request(app)
                    .get('/api/lessons')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).toEqual(mockResponseBody);
                        if (err) return done(err);
                        done();
                    });
            });
        });
    });

    describe('when user type is student', () => {
        beforeEach(() => {
            users.getUserTypeById = jest
                .fn()
                .mockResolvedValue([{ type: 'student' }]);
        });

        it('should respond with a 500 error when something went wrong fetching the lessons data for a user', (done) => {
            lessons.getStudentLessonsByUserId = jest
                .fn()
                .mockRejectedValue('Mock error yo!');

            request(app)
                .get('/api/lessons')
                .expect(500)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).toEqual('Error fetching lessons');
                    if (err) return done(err);
                    done();
                });
        });

        it('should respond with a 200 and empty lesson data when user is not found', (done) => {
            const expectedResponse = [];

            lessons.getStudentLessonsByUserId = jest.fn().mockResolvedValue([]);

            request(app)
                .get('/api/lessons')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).toEqual(expectedResponse);
                    if (err) return done(err);
                    done();
                });
        });

        it('should return 200 and lesson data when lessons are succesfully fetched for a user', (done) => {
            const mockUserId = 12345;
            const mockResponseBody = [
                {
                    id: 1,
                    teacher_id: mockUserId,
                    class_id: 1,
                },
            ];

            lessons.getStudentLessonsByUserId = jest
                .fn()
                .mockResolvedValue(mockResponseBody);

            request(app)
                .get('/api/lessons')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(mockResponseBody);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('#/api/create-account', () => {
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

    describe('#/api/lessons/:lessonId/attendance', () => {
        it('should respond with a 500 error if something goes wrong updating the database', (done) => {
            lessons.updateLessonAttendance = jest
                .fn()
                .mockRejectedValue('mock error!');

            request(app)
                .put('/api/lessons/1/attendance')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

        it('should respond with a 200 success whenever the database successfully updates with attendance', (done) => {
            const expectedResponse = 'Successfully updated attendance';

            lessons.updateLessonAttendance = jest
                .fn()
                .mockResolvedValue('Mock success');

            request(app)
                .put('/api/lessons/1/attendance')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(expectedResponse);
                    if (err) return done(err);
                    done();
                });
        });
    });
});
