import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const inv = {
  message: '',
  subject: '',
  receiver: '',
  sender: '',
};

const validMail = {
  sender: 'seun2@epic.com',
  subject: 'Hello',
  message: 'Hi',
  status: 'sent',
  receiver: 'seun2@epic.com',
};

const invalidMail = {
  sender: 'seun@epic.com',
  subject: 'You are welcome',
  message: 'Feel free',
  status: 'sent',
  receiver: 'seunwring@epic.com',
};

// Test message POST request
describe('POST api/v1/messages', () => {
  it('Should send new message if required inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .send(validMail)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(201);
        expect(body.data[0]).to.haveOwnProperty('message');
        done();
      });
  });
});

//  Test for receiver does not exist
describe('POST api/v1/messages', () => {
  it('Should give an error if receiver does not exist', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .send(invalidMail)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(404);
        expect(body.error).to.be.a('string');
        expect(body.error).to.be.equals('Address of receiver not recognized');

        done();
      });
  });
});

describe('POST api/v1/messages', () => {
  it('Should give an error if message inputs is not valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .send(inv)
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(400);
        expect(body.errors).to.be.an('object');
        expect(body).to.haveOwnProperty('errors');
        done();
      });
  });
});

// Test GET messages request
describe('GET api/v1/messages', () => {
  it('Should get all messages if user is logged in', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages')
      .send(validMail)
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('message');

        done();
      });
  });
});
