
const axios = require('axios');
require('dotenv').config();

// config defaults for axios
// axios.defaults.baseURL = `${process.env.API_URL}/bins`;
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const userData = {
  email: 'randomJk@mail.cu',
  username: 'Eve Dalot',
  password: 'thaei!3jiZ'
};

const binData = {
  lat: '38.8951',
  lng: '-77.0364',
  max_weight: 4.5,
  min_height: 100,
  current_weight: 12.25,
  current_height: 10,
  bin_code: 'BINA1'
};

let authToken; // to store the token received for authenticating requests after login
let userid; //
let binId; // to store the id that will be received when a bin is created
// will be used later

// first need to setup a user since bin routes need authentication
describe('Init User', () => {
  describe('Create User', () => {
    test('Axios POST user data', async (done) => {
      try {
        const response = await axios.post('/users', userData);
        expect(response.data.message).toBe('user successfully created');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('User Login', () => {
    test('Axios POST login data', async (done) => {
      try {
        const response = await axios.post('/login', userData);
        authToken = response.data.token;
        userid = response.data.id;
        expect(authToken).not.toBeNull();
        expect(userid).not.toBeNull();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

describe('Bin Tests', () => {
  // each test is wrapped inside a describe block so that they can run sequentially
  // describe blocks are executed synchronously
  describe('Create Bin', () => {
    test('Axios POST bin data', async (done) => {
      try {
        const config = { headers: { authorization: authToken, userid } };
        const response = await axios.post('/bins', binData, config);
        const statusCode = response.status;
        binId = response.data.binId;
        expect(statusCode).toBe(201);
        expect(binId).not.toBeNull();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('Get All Bins', () => {
    test('Axios GET', async (done) => {
      try {
        // authToken was set earlier upon login
        const config = { headers: { authorization: authToken, userid } };
        const response = await axios.get('/bins', config);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('Get Bin By Id', () => {
    test('Axios GET with ID', async (done) => {
      try {
        const config = { headers: { authorization: authToken, userid } };
        const response = await axios.get(`/bins/${binId}`, config);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('Update Bin', () => {
    test('Axios PUT', async (done) => {
      try {
        const data = {
          current_height: 20,
          current_weight: 30
        };
        const config = { headers: { authorization: authToken, userid } };
        const response = await axios.put(`/bins/${binId}`, data, config);
        expect(response.status).toBe(201);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('Delete Bin', () => {
    test('Axios DELETE', async (done) => {
      try {
        const config = { headers: { authorization: authToken, userid } };
        const response = await axios.delete(`/bins/${binId}`, config);
        expect(response.status).toBe(201);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
