import request from 'supertest';
import index from '../index';
import { configureAppForTest } from '../test-utils';

const testApp = configureAppForTest(index);

describe('Test the routes', () => {
    test('GET /getAllBestTimes should return 200 and a message', async () => {
      const response = await request(testApp).get('/getAllBestTimes');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'This is getAllBestTimes endpoint');
    });

    test('GET /getAllBestTimes should return 500 for server error during retrieval', async () => {
        // Mocking a server error during the retrieval
        jest.spyOn(testApp.locals.db, 'all').mockImplementation((_sql, _params, callback: any) => {
          callback(new Error('Simulated server error during retrieval'), null);
        });
    
        const response = await request(testApp)
          .get('/getAllBestTimes')
          .set('Authorization', 'Bearer validToken');
    
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Server error');
    
        // Restore the original implementation
        jest.restoreAllMocks();
    });
  
    test('POST /register should return 201 and a message for successful registration', async () => {
      const response = await request(testApp)
        .post('/register')
        .send({
          username: 'testuser',
          password: 'testpassword',
          best_time: 120,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'This is register endpoint');
    });

    test('POST /register should return 400 for duplicate username', async () => {
        const response = await request(testApp)
          .post('/register')
          .send({
            username: 'existinguser', // Assuming this username already exists in the database
            password: 'newpassword',
          });
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Username is already taken');
    });
  
    test('POST /login should return 200 and a message for successful login', async () => {
      const response = await request(testApp)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'testpassword',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'This is login endpoint');
    });

    test('POST /login should return 401 for invalid credentials', async () => {
        const response = await request(testApp)
          .post('/login')
          .send({
            username: 'nonexistentuser', // Assuming this username does not exist in the database
            password: 'invalidpassword',
          });
    
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  
    test('PUT /editBestTime should return 200 and a message for successful update', async () => {
      // Assume you have an existing user 'testuser' in the database
      const loginResponse = await request(testApp)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'testpassword',
        });
  
      const token = loginResponse.body.token;
  
      const response = await request(testApp)
        .put('/editBestTime')
        .set('Authorization', `Bearer ${token}`)
        .send({
          best_time: 110,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'This is editBestTime endpoint');
    });
  
    test('GET /nonexistentRoute should return 404', async () => {
      const response = await request(testApp).get('/nonexistentRoute');
      expect(response.statusCode).toBe(404);
    });

});