const request = require('supertest')
const app = require('../index.js');
const db  = require('../app/models/index.js');
const User = db.user;

beforeAll(async() =>{
   await User.destroy({
    where: { username: "aqib23" }
  });
})
describe('POST /api/auth/signup', function() {
  it('User is created', async () => {
    await request(app)
          .post('/api/auth/signup/')
          .send({
            "username": "aqib23",
            "email":"aqib@gmail.com",
            "password": "aqib"
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(async (response) => {
            // Check the response
            expect(response.body.message).toBe("User was registered successfully!");
          });
        
    });

    it('User is already created', async () => {
    await request(app)
          .post('/api/auth/signup/')
          .send({
            "username": "aqib23",
            "email":"aqib@gmail.com",
            "password": "aqib"
          })
          .expect(500)
          .then(async (response) => {
            // Check the response
            expect(response.body.message).toBe("Validation error");
    
          });
        
    });

    it('Username validation error null', async () => {
      await request(app)
            .post('/api/auth/signup/')
            .send({
              "username": null,
              "email":"aqib@gmail.com",
              "password": "aqib"
            })
            .expect(500)
            .then(async (response) => {
              // Check the response
              expect(response.body.message).toBe("notNull Violation: users.username cannot be null");
      
            });
          
       });

       it('Email is not proper format', async () => {
        await request(app)
              .post('/api/auth/signup/')
              .send({
                "username": "aqib23",
                "email":"aqib",
                "password": "aqib"
              })
              .expect(500)
              .then(async (response) => {
                // Check the response
                expect(response.body.message).toBe("Validation error: Validation isEmail on email failed");
        
              });
            
         });
  });

describe('POST /api/auth/signin/', function() {
  it('responds with json and should match with attributes ', async () => {
    await request(app)
          .post('/api/auth/signin/')
          .send({
            "username": "aqib23",
            "password": "aqib"
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(async (response) => {
            // Check the response
            expect(response.body.id).not.toBeUndefined();
            expect(response.body.username).toBe("aqib23");
            expect(response.body.email).toBe("aqib@gmail.com");
            expect(response.body.accessToken).not.toBeNull();
    
          });
        
    });
}); 