const request = require('supertest')
const app = require('../index.js');
const db  = require('../app/models/index.js');
const Author = db.author;

var token = null;
var id = null;
  beforeAll(async() =>{
    await request(app)
            .post('/api/auth/signin/')
            .send({
              "username": "aqib23",
              "password": "aqib"
            })
            .then(async (response) => {
              // store token value
              token = response.body.accessToken
      
            });   
          
  })

  describe('GET /api/authors/', function() {
      it('responds with json and Status OK', async () => {
        await request(app)
              .get('/api/authors/')
              .set('Authorization', 'Bearer '+ token)
              .expect(200)
              .expect('Content-Type', /json/)
            
        });
    });

describe('POST /api/authors/', function() {
  it('UnAuthorized User', async () => {
    await request(app)
        .post('/api/authors/')
        .set('Authorization', 'Bearer '+ "token")
        .field('name', "Author1")
        .field('email', "author@gmail.com")
        .attach('file', `${__dirname}/auth_books.csv`)
        .expect(401)
        .then(async (response) => {
          // Check the response
          expect(response.body.message).toBe("Unauthorized!");
  
        });
      
  });
  it('Author are created', async () => {
    await request(app)
          .post('/api/authors/')
          .set('Authorization', 'Bearer '+ token)
          .field('name', "Author1")
          .field('email', "author@gmail.com")
          .attach('file', `${__dirname}/auth_books.csv`)
          .expect(201)
          .expect('Content-Type', /json/)
          .then(async (response) => {
            // Check the response
            expect(response.body.message).toBe("Authors are created successfully!");
          });
        
    });

  });

describe('GET /api/authors/:authorId', function() {
  it('responds with json and Status OK', async () => {
    await Author.findOne({
      where: {
        name: "silvia"
      }
    })
    .then(author => {
          id = author.id
    })

    await request(app)
          .get('/api/authors/'+id)
          .set('Authorization', 'Bearer '+ token)
          .expect(200)
          .expect('Content-Type', /json/)
          .then( response => {
            // Check the response
            expect(response.body.author.id).toBe(id);
            expect(response.body.author.name).toBe("silvia");
    
          });
        
    });

    it('Author Id is not exist', async () => {
      
      await request(app)
            .get('/api/authors/'+120)
            .set('Authorization', 'Bearer '+ token)
            .expect(404)
            .expect('Content-Type', /json/)
            .then( response => {
              // Check the response
              expect(response.body.message).toBe("author not found with id 120");
      
            });
          
      });
    
});

describe('PUT /api/authors/:authorId', function() {
  it('responds with json and Status OK', async () => {
    await request(app)
          .put('/api/authors/'+id)
          .set('Authorization', 'Bearer '+ token)
          .send({
            name: "silvia",
            email:"silvia@gmail.com"
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then( response => {
            // Check the response
            expect(response.body.message).toBe("Author is updated successfully!");
    
    
          });
        
    });

    it('Author Id is not exist', async () => {
      
      await request(app)
            .put('/api/authors/'+120)
            .set('Authorization', 'Bearer '+ token)
            .send({
                name: "Aqib",
                email:"aqib@gmail.com"
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then( response => {
              // Check the response
              expect(response.body.message).toBe("Failed! author not found with id!");
      
            });
          
      });

      it('Author name is empty', async () => {
        await request(app)
              .put('/api/authors/'+id)
              .set('Authorization', 'Bearer '+ token)
              .send({
                name: ""
              })
              .expect(400)
              .expect('Content-Type', /json/)
              .then( response => {
                // Check the response
                expect(response.body.message).toBe("Author name can not be empty");
        
        
              });
            
        });
    
});
