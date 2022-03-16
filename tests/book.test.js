const request = require('supertest')
const app = require('../index.js');
const db  = require('../app/models/index.js');
const Author = db.author;
const Book = db.book;

var token = null;
var id = null;
var authorId = null

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
  
    await Author.findOne({
      where: {
        name: "silvia"
      }
    })
    .then(author => {
      authorId = author.id
    })
           
})

describe('GET /api/authors/:authorId/books/', function() {
    it('responds with json and Status OK', async () => {
      await request(app)
            .get('/api/authors/'+authorId+'/books/')
            .set('Authorization', 'Bearer '+ token)
            .expect(200)
            .expect('Content-Type', /json/)
          
   });
});

describe('POST /api/authors/:authorId/books/', function() {
  it('UnAuthorized User', async () => {
    await request(app)
        .post('/api/authors/'+authorId+'/books/')
        .set('Authorization', 'Bearer '+ "token")
        .field('name', "Book1")
        .attach('file', `${__dirname}/auth_books.csv`)
        .expect(401)
        .then(async (response) => {
          // Check the response
          expect(response.body.message).toBe("Unauthorized!");
  
        });
      
  });
  it('Books are created', async () => {
    await request(app)
          .post('/api/authors/'+authorId+'/books/')
          .set('Authorization', 'Bearer '+ token)
          .field('name', "Book1")
          .attach('file', `${__dirname}/auth_books.csv`)
          .expect(201)
          .expect('Content-Type', /json/)
          .then(async (response) => {
            // Check the response
            expect(response.body.message).toBe("Books are created successfully!");
          });
        
  });

});

describe('GET /api/authors/:authorId/books/:bookId', function() {
  it('responds with json and Status OK', async () => {
    await Book.findOne({
      where: {
        name: "NodeJs"
      }
    })
    .then(book => {
          id = book.id
    })
    await request(app)
          .get('/api/authors/'+authorId+'/books/'+id)
          .set('Authorization', 'Bearer '+ token)
          .expect(200)
          .expect('Content-Type', /json/)
          .then( response => {
            // Check the response
            expect(response.body.book.id).toBe(id);
            expect(response.body.book.name).toBe("NodeJs");
    
          });
        
  });

  it('Book Id is not exist', async () => {
      await request(app)
            .get('/api/authors/'+authorId+'/books/'+120)
            .set('Authorization', 'Bearer '+ token)
            .expect(404)
            .expect('Content-Type', /json/)
            .then( response => {
              // Check the response
              expect(response.body.message).toBe("book not found with id 120");
      
            });
          
  });
    
});

describe('PUT /api/authors/:authorId/books/:bookId', function() {
  it('responds with json and Status OK', async () => {
    await request(app)
          .put('/api/authors/'+authorId+'/books/'+id)
          .set('Authorization', 'Bearer '+ token)
          .send({
            name: "NodeJs"
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .then( response => {
            // Check the response
            expect(response.body.message).toBe("Book is updated successfully!");
    
    
          });
        
  });

  it('Book Id is not exist', async () => { 
      await request(app)
            .put('/api/authors/'+authorId+'/books/'+120)
            .set('Authorization', 'Bearer '+ token)
            .send({
              name: "NodeJs"
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then( response => {
              // Check the response
              expect(response.body.message).toBe("Failed! book not found with id!");
      
            });
          
  });
    
});