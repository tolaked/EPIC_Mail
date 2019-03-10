import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const user = {

    "email": "seun2@epic.com",
    "firstname":"Akere",
    "lastname": "Adetola",
    "password": "breeks29"
}


// Test suite for home route
describe('GET /', () => {
 it('Should redirect to home route', (done) => {
   chai
     .request(app)
     .get('/')
     .end((err, res) => {
       if (err) done();
       const { body } = res;
       expect(body).to.be.an('object');
       expect(body.status).to.be.a('number');
       expect(body.status).to.be.equals(200);
       expect(body.data[0]).to.haveOwnProperty('message');
       expect(body.data[0].message).to.be.a('string');
       done();
     });
 });
});


// Test suite for signup route
describe('GET api/v1/auth/signup', () => {
  it('Should signup a new user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(201);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
 });

 
// Test suite for signup route
describe('GET api/v1/auth/login', () => {
  it('Should signin a new user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
 });


