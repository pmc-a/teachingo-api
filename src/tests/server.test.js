const { app } = require('../server');
const request = require('supertest');

describe('server', () => {
    it('should return 200 from the status endpoint', (done) => {
        request(app)
            .get('/api/status')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
