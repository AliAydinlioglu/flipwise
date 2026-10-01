import supertest from "supertest";
import createServer from "../../src/createServer";
import type Koa from "koa";
import textCodes from "../../src/constants/textCodes";
import testData from "../testdata";
import testEndpoints from "../testEndpoints";
import endpoints from "../../src/constants/endpoints";
import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
// TEST DATA

// TESTS
let jwts: string[] = [];
let server: { getKoa: () => Koa; start: () => Promise<void>; stop: () => Promise<void> };
let request: supertest.SuperTest<supertest.Test>;
let test_data: { createTestData: () => Promise<void>; deleteTestData: () => Promise<void>; getJWTs: () => string[] };

const apiUserFolderCardScore = endpoints.apiPrefix + endpoints.userPrefix + endpoints.userScoreEndpoint;

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

describe("/scores", () => {
  it("GET - Should return a single card score for Solomon", async () => {
    const jwt = jwts[0]; // Solomon Reed's JWT

    const response = await request.get(testEndpoints.apiUserFolder).set({
      Authorization: `Bearer ${jwt}`,
    });
    const folder_id = response.body[0].id;

    const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
      Authorization: `Bearer ${jwt}`,
    });
    const card_id = response2.body[0].id;

    const response3 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
      Authorization: `Bearer ${jwt}`,
    });

    expect(response3.status).toBe(200);
    expect(response3.body).toBe(99);
  });
  it("GET - Should fail due to Solomon trying to access Rosalind's card while using a correct folder id.", async () => {
    const solomonJWT = jwts[0]; // Solomon Reed's JWT
    const rosalindJWT = jwts[1]; // Rosalind Myers' JWT

    // Solomon Reed
    const solomon = await request.get(testEndpoints.apiUserFolder).set({
      Authorization: `Bearer ${solomonJWT}`,
    });
    const solomonFolderID = solomon.body[0].id;

    // Rosalind Myers
    const rosalind = await request.get(testEndpoints.apiUserFolder).set({
      Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
    });
    const rosalindFolderID = rosalind.body[0].id; // Rosalind Myers

    const rosalind2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, rosalindFolderID)).set({
      Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
    });
    const rosalindCardID = rosalind2.body[0].id; // Rosalind Myers

    // Solomon Reed trying to access Rosalind's card.
    const response3 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, solomonFolderID).replace(endpoints.cardID, rosalindCardID)).set({
      Authorization: `Bearer ${solomonJWT}`, // Solomon Reed
    });

    expect(response3.status).toBe(404);
    expect(response3.body.message).toBe(textCodes.NOCARDFOUND); // We are filtering through Solomon's cards, so we should get a 404 and not 403.
  });

  describe("POST", () => {
    it("POST - Should create a score for So Mi", async () => {
      const jwt = jwts[2]; //  So Mi's JWT

      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwt}`,
      });
      const folder_id = response.body[0].id;

      const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
        Authorization: `Bearer ${jwt}`,
      });
      const card_id = response2.body[2].id;

      const creationResponse = await request
        .post(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id))
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({
          score: 123456789,
        });

      expect(creationResponse.status).toBe(204);

      const response4 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response4.status).toBe(200);
      expect(response4.body).toBe(123456789);
    });
    it("POST - Should fail due to trying to create a score for someone else's card.", async () => {
      const solomonJWT = jwts[0]; // Solomon Reed's JWT
      const rosalindJWT = jwts[1]; // Rosalind Myers' JWT

      // Solomon Reed
      const solomon = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${solomonJWT}`,
      });
      const solomonFolderID = solomon.body[0].id;

      // Rosalind Myers
      const rosalind = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });
      const rosalindFolderID = rosalind.body[0].id; // Rosalind Myers

      const rosalind2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, rosalindFolderID)).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });
      const rosalindCardID = rosalind2.body[0].id; // Rosalind Myers

      // Solomon Reed trying to access Rosalind's card.

      const response3 = await request
        .post(apiUserFolderCardScore.replace(endpoints.folderID, solomonFolderID).replace(endpoints.cardID, rosalindCardID))
        .set({
          Authorization: `Bearer ${solomonJWT}`, // Solomon Reed
        })
        .send({
          score: 100,
        });

      expect(response3.status).toBe(404);
      expect(response3.body.message).toBe(textCodes.NOCARDFOUND); // We are filtering through Solomon's cards, so we should get a 404 and not 403.
    });

    it("POST - Should fail due to trying to create a score for a card that already has a score.", async () => {
      const jwt = jwts[0]; // Solomon Reed's JWT

      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwt}`,
      });
      const folder_id = response.body[0].id;

      const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
        Authorization: `Bearer ${jwt}`,
      });
      const card_id = response2.body[0].id;

      const creationResponse = await request
        .post(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id))
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({
          score: 123456789,
        });

      expect(creationResponse.status).toBe(400);
      expect(creationResponse.body.message).toBe(textCodes.SCOREALREADYEXISTS);
    });
  });
  describe("PUT", () => {
    it("PUT - Should update a score for So Mi", async () => {
      const jwt = jwts[2]; //  So Mi's JWT

      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwt}`,
      });
      const folder_id = response.body[0].id;

      const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
        Authorization: `Bearer ${jwt}`,
      });
      const card_id = response2.body[1].id;
      const card_name = response2.body[1].front;

      const response3 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response3.status).toBe(200);
      expect(response3.body).toBe(7);

      const creationResponse = await request
        .put(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id))
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({
          score: 100,
        });

      expect(creationResponse.status).toBe(200);
      expect(creationResponse.body).toBe(100);

      const response4 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response4.status).toBe(200);
      expect(response4.body).toBe(100);
    });

    it("PUT - Should fail to update a score for So Mi due to score not existing", async () => {
      const jwt = jwts[2]; //  So Mi's JWT

      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwt}`,
      });
      const folder_id = response.body[0].id;

      const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
        Authorization: `Bearer ${jwt}`,
      });
      const card_id = response2.body[2].id;

      const creationResponse = await request
        .put(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id))
        .set({
          Authorization: `Bearer ${jwt}`,
        })
        .send({
          score: 987654321,
        });

      expect(creationResponse.status).toBe(404);
      expect(creationResponse.body.message).toBe(textCodes.NOSCOREFOUND);

      const response4 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response4.status).toBe(404);
      expect(response4.body.message).toBe(textCodes.NOSCOREFOUND);
    });
    it("PUT - Should fail due to trying to update a score for someone else's card.", async () => {
      const solomonJWT = jwts[0]; // Solomon Reed's JWT
      const rosalindJWT = jwts[1]; // Rosalind Myers' JWT

      // Solomon Reed
      const solomon = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${solomonJWT}`,
      });
      const solomonFolderID = solomon.body[0].id;

      // Rosalind Myers
      const rosalind = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });
      const rosalindFolderID = rosalind.body[0].id; // Rosalind Myers

      const rosalind2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, rosalindFolderID)).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });
      const rosalindCardID = rosalind2.body[0].id; // Rosalind Myers

      // Solomon Reed trying to access Rosalind's card.
      const response3 = await request
        .put(apiUserFolderCardScore.replace(endpoints.folderID, solomonFolderID).replace(endpoints.cardID, rosalindCardID))
        .set({
          Authorization: `Bearer ${solomonJWT}`, // Solomon Reed
        })
        .send({
          score: 100,
        });

      expect(response3.status).toBe(404);
      expect(response3.body.message).toBe(textCodes.NOCARDFOUND); // We are filtering through Solomon's cards, so we should get a 404 and not 403.
    });
  });
  describe("DELETE", () => {
    it("DELETE - Should delete a score for So Mi", async () => {
      const jwt = jwts[2]; //  So Mi's JWT

      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwt}`,
      });
      const folder_id = response.body[0].id;

      const response2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, folder_id)).set({
        Authorization: `Bearer ${jwt}`,
      });
      const card_id = response2.body[0].id;

      const response3 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response3.status).toBe(200);
      expect(response3.body).toBe(6);

      const creationResponse = await request.delete(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(creationResponse.status).toBe(204);

      const response4 = await request.get(apiUserFolderCardScore.replace(endpoints.folderID, folder_id).replace(endpoints.cardID, card_id)).set({
        Authorization: `Bearer ${jwt}`,
      });

      expect(response4.status).toBe(404);
      expect(response4.body.message).toBe(textCodes.NOSCOREFOUND);
    });
    it("DELETE - Should fail due to trying to delete a score for someone else's card.", async () => {
      const solomonJWT = jwts[0]; // Solomon Reed's JWT
      const rosalindJWT = jwts[1]; // Rosalind Myers' JWT

      // Solomon Reed
      const solomon = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${solomonJWT}`,
      });
      const solomonFolderID = solomon.body[0].id;

      // Rosalind Myers
      const rosalind = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });
      const rosalindFolderID = rosalind.body[0].id; // Rosalind Myers

      const rosalind2 = await request.get(testEndpoints.apiUserFolderCard.replace(endpoints.folderID, rosalindFolderID)).set({
        Authorization: `Bearer ${rosalindJWT}`, // Rosalind Myers
      });

      const rosalindCardID = rosalind2.body[0].id; // Rosalind Myers

      // Solomon Reed trying to access Rosalind's card.
      const response3 = await request.delete(apiUserFolderCardScore.replace(endpoints.folderID, solomonFolderID).replace(endpoints.cardID, rosalindCardID)).set({
        Authorization: `Bearer ${solomonJWT}`, // Solomon Reed
      });

      expect(response3.status).toBe(404);
      expect(response3.body.message).toBe(textCodes.NOCARDFOUND); // We are filtering through Solomon's cards, so we should get a 404 and not 403.

      const response4 = await request.delete(apiUserFolderCardScore.replace(endpoints.folderID, rosalindFolderID).replace(endpoints.cardID, rosalindCardID)).set({
        Authorization: `Bearer ${solomonJWT}`, // Solomon Reed
      });
      expect(response4.status).toBe(404);
      expect(response4.body.message).toBe(textCodes.NOFOLDERFOUND); // We are filtering through Solomon's cards, so we should get a 404 and not 403.
    });
  });
});
