import supertest from "supertest";
import createServer from "../../src/createServer";
import type Koa from "koa";
import errorCodes from "../../src/constants/textCodes";
import textCodes from "../../src/constants/textCodes";
import testData from "../testdata";
import endpoints from "../../src/constants/endpoints";
import testEndpoints from "../testEndpoints";
// TEST DATA

// TESTS
let jwts: string[] = [];
let server: { getKoa: () => Koa; start: () => Promise<void>; stop: () => Promise<void> };
let request: supertest.SuperTest<supertest.Test>;
let test_data: { createTestData: () => Promise<void>; deleteTestData: () => Promise<void>; getJWTs: () => string[] };

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

describe("api/users/cardoverviews/:cardID", () => {
  it("GET - Should return a cardoverview.", async () => {
    const jwt = jwts[0]; // Solomon Reed's JWT

    const response = await request.get(testEndpoints.apiCardOverview.replace(":cardID", "1")).set({
      Authorization: `Bearer ${jwt}`,
    });

    expect(response.status).toBe(200);
    expect(response.body.front).toBe("1+1");
    expect(response.body.back).toBe("2");
    expect(response.body.folder_id).toBe(1);
    expect(response.body.score).toBe(99);
  });
  it("GET - Should throw error for trying to access someone else's card", async () => {
    const jwt = jwts[1]; // Rosalind Myers's JWT

    const response = await request.get(testEndpoints.apiCardOverview.replace(":cardID", "1")).set({
      Authorization: `Bearer ${jwt}`,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(errorCodes.NOCARDSOVERVIEWFOUND);
  });
});
