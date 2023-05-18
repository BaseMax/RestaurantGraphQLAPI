import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: any;
  let usersData: any[];
  let restaurantsData: any[];
  let foodsData: any[];
  let reviewsData: any[];

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Connect to the database
    db = app.get('DATABASE_CONNECTION');
  });

  beforeEach(async () => {
    // Clean the database and insert initial data
    await db.collection('users').deleteMany({});
    await db.collection('restaurants').deleteMany({});
    await db.collection('foods').deleteMany({});
    await db.collection('reviews').deleteMany({});

    const password = await argon2.hash('password');
    const users = [
      {
        email: 'user1@example.com',
        name: 'User 1',
        password,
        role: 0, // normal user
      },
      {
        email: 'user2@example.com',
        name: 'User 2',
        password,
        role: 0, // normal user
      },
      {
        email: 'user3@example.com',
        name: 'User 3',
        password,
        role: 1, // admin
      },
      {
        email: 'user4@example.com',
        name: 'User 4',
        password,
        role: 1, // admin
      },
      {
        email: 'user5@example.com',
        name: 'User 5',
        password,
        role: 2, // superadmin
      },
    ];
    await db.collection('users').insertMany(users);
    usersData = await db.collection('users').find().toArray();

    const restaurants = [
      {
        name: 'Restaurant A',
        location: {
          type: 'Point',
          coordinates: [51.5074, -0.1278],
        },
        address: '1 London Bridge St, London SE1 9BG',
        rating: 4,
        cuisine: 'British',
        creatorId: usersData[2]._id.toString(), // admin
      },
      {
        name: 'Restaurant B',
        location: {
          type: 'Point',
          coordinates: [48.8566, 2.3522],
        },
        address: '5 Rue de la Paix, 75002 Paris, France',
        rating: 3,
        cuisine: 'French',
        creatorId: usersData[3]._id.toString(), // admin
      },
    ];
    await db.collection('restaurants').insertMany(restaurants);
    restaurantsData = await db.collection('restaurants').find().toArray();

    const foods = [
      {
        name: 'Food 1',
        description: 'Description for Food 1',
        price: 15,
        restaurantId: restaurantsData[0]._id.toString(),
        creatorId: usersData[2]._id.toString(), // admin
      },
      {
        name: 'Food 2',
        description: 'Description for Food 2',
        price: 20,
        restaurantId: restaurantsData[0]._id.toString(),
        creatorId: usersData[3]._id.toString(), // admin
      },
      {
        name: 'Food 3',
        description: 'Description for Food 3',
        price: 25,
        restaurantId: restaurantsData[1]._id.toString(),
        creatorId: usersData[0]._id.toString(), // normal user
      },
      {
        name: 'Food 4',
        description: 'Description for Food 4',
        price: 30,
        restaurantId: restaurantsData[1]._id.toString(),
        creatorId: usersData[1]._id.toString(), // normal user
      },
    ];
    await db.collection('foods').insertMany(foods);
    foodsData = await db.collection('foods').find().toArray();

    const reviews = [
      {
        restaurantId: restaurantsData[0]._id.toString(),
        comment: 'Comment from User 1',
        rating: 3,
        userId: usersData[0]._id.toString(),
      },
      {
        restaurantId: restaurantsData[0]._id.toString(),
        comment: 'Comment from User 2',
        rating: 4,
        userId: usersData[1]._id.toString(),
      },
      {
        restaurantId: restaurantsData[1]._id.toString(),
        comment: 'Comment from User 3',
        rating: 5,
        userId: usersData[2]._id.toString(),
      },
      {
        restaurantId: restaurantsData[1]._id.toString(),
        comment: 'Comment from User 1',
        rating: 2,
        userId: usersData[0]._id.toString(),
      },
    ];
    await db.collection('reviews').insertMany(reviews);
    reviewsData = await db.collection('reviews').find().toArray();
  });
  describe('login', () => {

    async function login(email: string, password: string): Promise<request.Response> {
      const mutation = `
        mutation Login($input: LoginUserInput!) {
          login(input: $input) {
            user { id name }
            token
          }
        }
      `;
      const variables = { input: { email, password } };
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables });
    }

    let user;
    beforeEach(() => { user = usersData[0] });

    it('should return an error if the user does not exist', async () => {
      const response = await login('nonexistinguser@example.com', 'password');
      expect(response.status).toBe(200);
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should return an error if the password is incorrect', async () => {
      const response = await login(user.email, 'wrongpassword');
      expect(response.status).toBe(200);
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should return the user and token if the credentials are correct', async () => {
      const response = await login(user.email, "password");
      expect(response.status).toBe(200);
      expect(response.body.data.login.user.id).toBe(user._id.toString());
      expect(response.body.data.login.user.name).toBe(user.name);
      expect(response.body.data.login.token).toBeTruthy();
    });
  });
  describe('User', () => {
    let user;
    beforeEach(() => { user = usersData[0] });

    describe('Query.user', () => {
      async function getUser(token: string): Promise<request.Response> {
        const query = `
        query {
          user {
            id
            name
          }
        }
      `;
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .set('Authorization', `Bearer ${token}`);
      }

      it('should return an error if the token is invalid', async () => {
        const response = await getUser('invalid_token');
        expect(response.status).toBe(200);
        expect(response.body.errors[0].extensions.code).toBe('FORBIDDEN');
      });

      it('should return the user if the token is valid', async () => {
        const token = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
            mutation Login($input: LoginUserInput!) {
              login(input: $input) {
                token
              }
            }
          `,
            variables: { input: { email: user.email, password: 'password' } },
          })
          .then(res => res.body.data.login.token);

        const response = await getUser(token);
        expect(response.status).toBe(200);
        expect(response.body.data.user.id).toBe(user._id.toString());
        expect(response.body.data.user.name).toBe(user.name);
      });
    });

  });

  describe('Registration', () => {
    it('should create a new user', async () => {
      // Define the mutation payload
      const registerMutation = `
        mutation Register($input: RegisterUserInput!) {
          register(input: $input) {
            user {
              id
              name
            }
            token
          }
        }
      `;
      const variables = {
        input: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'Test123!',
        },
      };

      // Send the mutation request and check the response
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: registerMutation, variables });

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeFalsy();
      expect(response.body.data.register.user.name).toBe('New User');
      expect(response.body.data.register.token).toBeTruthy();

      // Check that the user was created in the database
      const newUser = await db.collection('users').findOne({
        email: 'newuser@example.com',
      });
      expect(newUser).toBeTruthy();
      expect(newUser.name).toBe('New User');
    });

    it('should return an error if the email is already in use', async () => {
      // Define the mutation payload
      const registerMutation = `
        mutation Register($input: RegisterUserInput!) {
          register(input: $input) {
            user {
              id
              name
            }
            token
          }
        }
      `;
      const variables = {
        input: {
          email: usersData[0].email,
          name: 'New User',
          password: 'Test123!',
        },
      };

      // Send the mutation request and check the response
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: registerMutation, variables });

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');

      // Check that the user was not created in the database
      const newUser = await db.collection('users').findOne({
        email: 'newuser@example.com',
      });
      expect(newUser).toBeFalsy();
    });
  });

  describe('Registration and Login', () => {
    it('should register a new user and then log in with the credentials', async () => {
      // Define the mutation payload for registration
      const registerMutation = `
        mutation Register($input: RegisterUserInput!) {
          register(input: $input) {
            user {
              id
              name
            }
            token
          }
        }
      `;
      const variables = {
        input: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'StrongPassword1!',
        },
      };

      // Send the registration mutation request and check the response
      const registerResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: registerMutation, variables });

      // Assert the response
      expect(registerResponse.status).toBe(200);
      expect(registerResponse.body.errors).toBeFalsy();
      expect(registerResponse.body.data.register.user.name).toBe('New User');
      expect(registerResponse.body.data.register.token).toBeTruthy();

      // Define the mutation payload for login
      const loginMutation = `
        mutation Login($input: LoginUserInput!) {
          login(input: $input) {
            user {
              id
              name
            }
            token
          }
        }
      `;
      const loginVariables = {
        input: {
          email: 'newuser@example.com',
          password: 'StrongPassword1!',
        },
      };

      // Send the login mutation request and check the response
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: loginMutation, variables: loginVariables });

      // Assert the response
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.errors).toBeFalsy();
      expect(loginResponse.body.data.login.user.name).toBe('New User');
      expect(loginResponse.body.data.login.token).toBeTruthy();
    });

    it('should return an error if the password is not strong enough', async () => {
      // Define the mutation payload for registration with a weak password
      const registerMutation = `
        mutation Register($input: RegisterUserInput!) {
          register(input: $input) {
            user {
              id
              name
            }
            token
          }
        }
      `;
      const variables = {
        input: {
          email: 'newuser@example.com',
          name: 'New User',
          password: 'weakpassword',
        },
      };

      // Send the registration mutation request and check the response
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: registerMutation, variables });

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });

});

