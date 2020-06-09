const axios = require('axios');

require('dotenv').config();

// config defaults for axios
axios.defaults.baseURL = process.env.API_URL;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// this suite relies on first starting the api server in ../src/backend/app.js
describe('User', () => {
  let resBody; // response body from creating user

  let token; // obtained on login

  // user details
  const userData = {
    email: 'randomJk@mail.cu',
    username: 'Eve Dalot',
    password: 'thaei!3jiZ'
  };

  // _id for authenticated user
  let authUserId;

  beforeAll((done) => {
    // create a user
    axios
      .post('/users', userData)
      .then((response) => {
        // assign reponse object to globally available resBody
        // for use in assertions
        resBody = response.data;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  // POST /users (register new user)
  test('user can register', () => {
    // this expects global var resBody to have success message
    expect(resBody.message).toBe('user successfully created');
  });


  // suite for tests that require authentication
  describe('authentication tests', () => {
    beforeAll((done) => {
      // login the user created in User suite beforeAll function
      axios
        .post('/login', userData)
        .then((response) => {
          token = response.data.token; // set global var token

          authUserId = response.data.id; // logged in user _id for jwt auth purposes

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // POST /login
    test('user can login', () => {
      // expects token not to be null
      expect(token).not.toBeNull();
    });

    // PUT /users/:id
    test('user can update profile', (done) => {
      // given authenticated user
      // when they hit the endpoint PUT /users/:id
      axios
        .put(
          `/users/${authUserId}`,
          {
            ...userData,
            username: 'newName',
            id: authUserId
          },
          {
            headers: {
              authorization: token
            }
          }
        )
        .then((response) => {
          // then there details are updated in db
          expect(response.data.message).toBe('user successfully updated');

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });


  // to ensure this test doesn't run before above
  // tests we wrap it in its own describe (suite)
  describe('deletion tests', () => {
    // DELETE /users/:id
    test('user can delete their account', (done) => {
      // given an authenticated user
      // when they hit the endpoint DELETE /users/:id
      axios
        .delete(
          `/users/${authUserId}`, // authUserId is id of a logged in user
          {
            headers: {
              authorization: token
            },
            data: {
              id: authUserId
            }
          }
        )
        .then((response) => {
          // then their account gets deleted
          expect(response.data.message).toBe('user successfully deleted');

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
