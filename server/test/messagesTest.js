import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;

// using chai-http middleware
chai.use(chaiHttp);

const inv = {
  message:"",
  subject: "Hi",
  receiver:"seu@epic.com",
  sender:"seun@epic.com"
  
  }
const validMail = {
  sender:'seun@epic.com',
  subject:'Hello',
  message:'Hi',
  status:'sent',
  receiver:'seun@epic.com',
};

const invalidMail = {
  sender:'seun@epic.com',
  subject:'You are welcome',
  message:'Feel free',
  status:'sent',
  receiver:'seunwring@epic.com',
}

 describe('GET api/v1/messages', () => {
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
        expect(body.data[0].message).to.be.a('object');
        done();
      });
  });
 });

//  Test for receiver does not exist
 describe('GET api/v1/messages', () => {
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

 describe('GET api/v1/messages', () => {
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
        expect(body.error).to.be.an('array');
        expect(body.error[0]).to.be.an('object');
        done();
      });
  });
 });
