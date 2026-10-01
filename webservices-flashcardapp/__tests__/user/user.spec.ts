import supertest from "supertest";
import createServer from "../../src/createServer";
import type Koa from "koa";
import userService from "../../src/service/user";
import jwtUse from "../../src/core/jwtUse";
import userRepository from "../../src/repository/user";
import errorCodes from "../../src/constants/textCodes";
import testData from "../testdata";
import endpoints from "../../src/constants/endpoints";
// TEST DATA

// TESTS
let jwts: string[] = [];
let server: { getKoa: () => Koa; start: () => Promise<void>; stop: () => Promise<void> };
let request: supertest.SuperTest<supertest.Test>;
let test_data: { createTestData: () => Promise<void>; deleteTestData: () => Promise<void>; getJWTs: () => string[] };

const userUserEndpoint = endpoints.apiPrefix + endpoints.userPrefix;

beforeAll(async () => {
  server = await createServer();
  request = supertest(server.getKoa().callback()); // www.example.com{request} -> www.example.com/api/user/folder
});

beforeEach(async () => {
  test_data = await testData();
  await test_data.createTestData();
  jwts = test_data.getJWTs();
});

afterEach(async () => {
  await test_data.deleteTestData();
});

afterAll(async () => {
  await server.stop();
});

describe("/users", () => {
  it("GET - No JWT - should 401 and return no jwt", async () => {
    // Will try to access the user endpoint without a session_id
    const response = await request.get(userUserEndpoint);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual(errorCodes.NOJWT);
  });
  it("GET - JWT - should 200 and return 3 items (id, name and email).", async () => {
    // Will try to access the user endpoint with a session_id
    const response = await request.get(userUserEndpoint).set({
      Authorization: `Bearer ${jwts[0]}`,
    });

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(3);

    const user = response.body;
    expect(user.id).toStrictEqual(jwtUse.getUserID(jwts[0])); // Solomon Reed
    expect(user.name).toStrictEqual("Solomon Reed"); // Solomon Reed
    expect(user.email).toStrictEqual("solomonreed@email.com"); // Solomon Reed
  });
  describe("PUT", () => {
    it("PUT - Should only change Solomon Reed's name to Judy Alvarez while keeping the id.", async () => {
      const sameId = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(sameId))!.name;

      expect(name).toBe("Solomon Reed");

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwts[0]}`,
        })
        .send({
          name: "Judy Alvarez",
        });

      const user = (await userService.find(sameId))!;

      expect(response.status).toBe(200);
      expect(user.name).toBe("Judy Alvarez");
      expect(user.email).toBe("solomonreed@email.com");
    });
    it("PUT - Should only change Solomon Reed's email to Judy Alvarez while keeping the id.", async () => {
      const sameId = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(sameId))!.name;

      expect(name).toBe("Solomon Reed");

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwts[0]}`,
        })
        .send({
          email: "judyalvarez@email.com",
        });

      const user = (await userService.find(sameId))!;

      expect(response.status).toBe(200);
      expect(user.name).toBe("Solomon Reed");
      expect(user.email).toBe("judyalvarez@email.com");
    });
    it("PUT - Should only change Solomon Reed's password to 'Panam Palmer'", async () => {
      const sameId = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(sameId))!.name;

      expect(name).toBe("Solomon Reed");

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwts[0]}`,
        })
        .send({
          password: "Panam Palmer",
        });

      const user = (await userService.find(sameId))!;

      expect(response.status).toBe(200);
      expect(user.name).toBe("Solomon Reed");
    });
    it("PUT - Should error for trying to change email to Rosalinds already existing email.", async () => {
      const sameId = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(sameId))!.name;

      expect(name).toBe("Solomon Reed");

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwts[0]}`,
        })
        .send({
          email: "rosalindmyers@email.com",
        });

      const user = (await userService.find(sameId))!;

      expect(response.status).toBe(405);
      expect(response.body.message).toBe(errorCodes.EMAILALREADYEXISTS);
    });
    it("PUT - Should throw an error when attempting to change the email to an existing email with different capitalization.", async () => {
      const sameId = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(sameId))!.name;

      expect(name).toBe("Solomon Reed");

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwts[0]}`,
        })
        .send({
          email: "ROSALINDMYERS@email.com",
        });

      const user = (await userService.find(sameId))!;

      expect(response.status).toBe(405);
      expect(response.body.message).toBe(errorCodes.EMAILALREADYEXISTS);
    });
    it("PUT - Should throw 400 for trying to change solomon's email adress", async () => {
      const jwt = jwts[0];
      const sameId = jwtUse.getUserID(jwt);
      const user = (await userService.find(sameId))!;

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({
          email: "notanemail",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('"email" must be a valid email');
      expect(user.email).toBe("solomonreed@email.com");
    });
    it("PUT - Should 400 for not sending any data.", async () => {
      const jwt = jwts[0];
      const sameId = jwtUse.getUserID(jwt);
      const user = (await userService.find(sameId))!;

      const response = await request
        .put(userUserEndpoint)
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('"value" must contain at least one of [name, email, password]');
    });
  });
  describe("DELETE", () => {
    it("DELETE - Should delete Solomon Reed' entry.", async () => {
      const initialAmountOfUsers = (await userRepository.devFindAll())!;
      const user_id = jwtUse.getUserID(jwts[0]);
      const name = (await userService.find(user_id))!.name;

      expect(name).toBe("Solomon Reed");

      const deleteResponse = await request.delete(userUserEndpoint).set({
        Authorization: "Bearer asdasd.asdasd.asdasd",
      });
      expect(deleteResponse.status).toBe(401);
      expect(deleteResponse.body.message).toBe(errorCodes.INVALIDJWT);

      const response = await request.delete(userUserEndpoint).set({
        Authorization: `Bearer ${jwts[0]}`,
      });

      const finalAmountOfUsers = await userRepository.devFindAll();

      expect(initialAmountOfUsers.length - finalAmountOfUsers.length).toBe(1);

      const user = await userService.find(user_id);
      expect(response.status).toBe(200);
      expect(user).toBeNull();
    });
  });
});
