import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../server';
import messageData from '../data/messages.json'

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const user = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'breeks29',
};

let userToken;
let DbnewUserToken;

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

// Test suite for signup route [JSON-TEST-V1]
describe('POST api/v1/auth/signup [JSON-TEST-V1]', () => {
  it('Should create a new user account [JSON-TEST-V1]', (done) => {
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

// Test suite for signup route [DATABASE-JSON-V1]
describe('POST api/v1/auth/login [DATABASE-JSON-V1]', () => {
  it('Should signin an existing user [DATABASE-JSON-V1]', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'seun2@epic.com',
        password: 'breeks29',
      })
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        userToken = body.data[0].token;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
});

// Test message POST request
describe('POST api/v1/messages', () => {
  it('Should send new message if required inputs are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/messages')
      .set('token', userToken)
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
      .set('token', userToken)
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
      .set('token', userToken)
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
      .set('token', userToken)
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

describe('GET api/v1/messages/unread', () => {
  it('Should return all unread received messages if any', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/unread')
      .set('token', userToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data).to.be.an('array');
        done();
      });
  });
});

// Test route to get sent messages
describe('GET api/v1/messages/sent', () => {
  it('Should get all sent messages if user is logged in', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/sent')
      .set('token', userToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data).to.be.an('array');

        done();
      });
  });
});

// Test route to get specific message
describe('GET api/v1/messages/:messageId', () => {
  it('Should return a specific message', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/1')
      .set('token', userToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;

        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data).to.be.an('array');
        expect(body.data.length).to.be.equal(1);

        done();
      });
  });
});

describe('DELETE api/v1/messages/:messageId', () => {
  it('Should delete a specific message', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages/2')
      .set('token', userToken)
      .end((err, res) => {
        if (err) done();
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data).to.be.an('array');
        expect(body.data[0]).to.be.an('object');
        expect(body.data.length).to.be.equal(1);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.a('string');
        done();
      });
  });
});

