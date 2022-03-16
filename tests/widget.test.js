const request = require('supertest')
const app = require('../index.js');
const db  = require('../app/models/index.js');
const Screen = db.screen;
const Solution = db.solution;
const Widget = db.widget;

var token = null;
var id = null;
var userId = null;
var name =""
var screenId = null
var solutionId = null

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
            userId = response.body.id
    
          });
  
  await request(app)
        .post('/api/solutions/')
        .set('Authorization', 'Bearer '+ token)
        .send({
        "name": "solution1"
  }).expect(200)
    .then(async (response) => {
    // Check the response
    solutionId = response.body.data.id

  }); 
      
  await request(app)
          .post('/api/screens/')
          .set('Authorization', 'Bearer '+ token)
          .send({
            "name": "screen1",
            "solutionId":solutionId
          })
          .expect(200)
          .then(async (response) => {
            // Check the response
            screenId = response.body.data.id
    
          });          
})

afterAll(async() =>{

  await Widget.destroy({
    where: {name: "widget1"}
  })
  await Screen.destroy({
    where: {name: "screen1"}
  })
  await Solution.destroy({
    where: {name: "solution1"}
  })

})
describe.skip('GET /api/screens/:screenId/widgets/', function() {
    it('responds with json and Status OK', async () => {
      await request(app)
            .get('/api/screens/'+screenId+'/widgets/')
            .set('Authorization', 'Bearer '+ token)
            .expect(200)
            .expect('Content-Type', /json/)
          
      });
});

describe.skip('POST /api/screens/:screenId/widgets/', function() {
    it('UnAuthorized User', async () => {
      await request(app)
          .post('/api/screens/'+screenId+'/widgets/')
          .set('Authorization', 'Bearer '+ "token")
          .send({
            "name": "widget1",
            "screenId":screenId
          })
          .expect(401)
          .then(async (response) => {
            // Check the response
            expect(response.body.message).toBe("Unauthorized!");
    
          });
        
    });
    it('Widget is created', async () => {
      await request(app)
            .post('/api/screens/'+screenId+'/widgets/')
            .set('Authorization', 'Bearer '+ token)
            .field('name', "widget1")
            .field('screenId', screenId)
            .attach('file', `${__dirname}/aizon.png`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(async (response) => {
              // Check the response
              id = response.body.data.id
              name = response.body.data.name
  
              expect(response.body.message).toBe("Widget is created successfully!");
              expect(response.body.data.name).toBe("widget1");
              expect(response.body.data.imageName).toBe("aizon.png");
              expect(response.body.data.bucketName).toBe("aizon-widget-images");
            });
          
      });
  
    });

describe.skip('GET /api/screens/:screenId/widgets/:widgetsId', function() {
      it('responds with json and Status OK', async () => {
        await request(app)
              .get('/api/screens/'+screenId+'/widgets/'+id)
              .set('Authorization', 'Bearer '+ token)
              .expect(200)
              .expect('Content-Type', /json/)
              .then( response => {
                // Check the response
                expect(response.body.id).toBe(id);
                expect(response.body.name).toBe(name);
        
              });
            
        });

        it('Widget Id is not exist', async () => {
          await request(app)
                .get('/api/screens/'+screenId+'/widgets/'+1)
                .set('Authorization', 'Bearer '+ token)
                .expect(404)
                .expect('Content-Type', /json/)
                .then( response => {
                  // Check the response
                  expect(response.body.message).toBe("widget not found with id 1");
          
                });
              
          });
        
    });

describe.skip('PUT /api/screens/:screenId/widgets/:widgetsId', function() {
      it('responds with json and Status OK', async () => {
        await request(app)
              .put('/api/screens/'+screenId+'/widgets/'+id)
              .set('Authorization', 'Bearer '+ token)
              .send({
                name: "widget1"
              })
              .expect(200)
              .expect('Content-Type', /json/)
              .then( response => {
                // Check the response
                expect(response.body.message).toBe("Widget is updated successfully!");
        
        
              });
            
        });

        it('Widget Id is not exist', async () => {
          await request(app)
                .put('/api/screens/'+screenId+'/widgets/'+1)
                .set('Authorization', 'Bearer '+ token)
                .send({
                  "name": "widget1"
                })
                .expect(404)
                .expect('Content-Type', /json/)
                .then( response => {
                  // Check the response
                  expect(response.body.message).toBe("Widget not found with id 1");
          
                });
              
        });
        
});