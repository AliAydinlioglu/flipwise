import supertest from "supertest";
import createServer from "../../src/createServer";
import type Koa from "koa";
import testData from "../testdata";
import textCodes from "../../src/constants/textCodes";
import testEndpoints from "../testEndpoints";
import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
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

describe("/folders", () => {
  it("GET - We should get all the public folders in the DB", async () => {
    const response = await request.get(testEndpoints.apiPublicFolder);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe("French");
    expect(response.body[1].name).toBe("physics");
  });
  describe("/:id", () => {
    it("GET - We should get the public folder with the given folderID.", async () => {
      const allFolders = await request.get(testEndpoints.apiPublicFolder);
      const folderID = allFolders.body[0].id;

      const singleFolder = await request.get(testEndpoints.apiPublicFolder + "/" + folderID);

      expect(singleFolder.status).toBe(200);
      expect(singleFolder.body.length).toBe(1);
      expect(singleFolder.body[0].name).toBe("French");
    });
    it("GET - We should not be able to access Solomon's private folder over the public router.", async () => {
      // get Solomon's private folder
      const response = await request.get(testEndpoints.apiUserFolder).set({
        Authorization: `Bearer ${jwts[0]}`, // Solomon's jwt
      });

      const folderID = response.body[0].id;

      // try to get Solomon's private folder over the public router
      const singleFolder = await request.get(testEndpoints.apiPublicFolder + "/" + folderID);

      expect(singleFolder.status).toBe(404);
      expect(singleFolder.body.message).toBe(textCodes.NOFOLDERFOUND);
    });
    describe("/card", () => {
      it("GET - We should get all the public cards in the DB", async () => {
        const allFolders = await request.get(testEndpoints.apiPublicFolder);
        const folderID = allFolders.body[0].id;

        const response = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
        expect(response.body[0].front).toBe("Le soleil");
        expect(response.body[1].front).toBe("La Lune");
        expect(response.body[2].front).toBe("Les étoiles");
      });
      it("GET - We should not be able to access Solomon's private folder cards over the public router.", async () => {
        // get Solomon's private folder
        const response = await request.get(testEndpoints.apiUserFolder).set({
          Authorization: `Bearer ${jwts[0]}`, // Solomon's jwt
        });

        const folderID = response.body[0].id;

        // try to get Solomon's private folder over the public router
        const singleFolder = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));

        expect(singleFolder.status).toBe(404);
        expect(singleFolder.body.message).toBe(textCodes.NOFOLDERFOUND);
      });
      describe("/:cardID", () => {
        it("GET - We should get the public card with the given cardID", async () => {
          const allFolders = await request.get(testEndpoints.apiPublicFolder);
          const folderID = allFolders.body[0].id;

          const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
          const cardID = allCards.body[0].id;

          const singleCard = await request.get(testEndpoints.apiPublicCardID.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString()));

          expect(singleCard.status).toBe(200);
          expect(singleCard.body.length).toBe(1);
          expect(singleCard.body[0].front).toBe("Le soleil");
        });
        describe("/score", () => {
          it("GET - We should get the score of the given card with So Mi's jwt, she has a score for this public folder.", async () => {
            const allFolders = await request.get(testEndpoints.apiPublicFolder);
            const folderID = allFolders.body[1].id;

            const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
            const cardID = allCards.body[0].id;

            const score = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
              Authorization: `Bearer ${jwts[2]}`,
            });

            expect(score.status).toBe(200);
            expect(score.body).toBe(6);
          });
          it("GET - We shouldn't get the score of the given card with Solomon's jwt", async () => {
            const allFolders = await request.get(testEndpoints.apiPublicFolder);
            const folderID = allFolders.body[1].id;

            const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
            const cardID = allCards.body[0].id;

            const score = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
              Authorization: `Bearer ${jwts[0]}`, // Solomon's jwt
            });

            expect(score.status).toBe(404);
            expect(score.body.message).toBe(textCodes.NOSCOREFOUND);
          });

          describe("POST", () => {
            it("POST - We should create a score for the given card with Solomon's jwt", async () => {
              const allFolders = await request.get(testEndpoints.apiPublicFolder);
              const folderID = allFolders.body[1].id;

              const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
              const cardID = allCards.body[0].id;

              const scoreCreate = await request
                .post(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString()))
                .set({
                  Authorization: `Bearer ${jwts[0]}`,
                })
                .send({ score: 654321 });

              expect(scoreCreate.status).toBe(204);

              const score2 = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                Authorization: `Bearer ${jwts[0]}`,
              });

              expect(score2.status).toBe(200);
              expect(score2.body).toBe(654321);
            });
            it("POST - We shouldn't create a score for the given card with So Mi's jwt, she already has a score for this public folder.", async () => {
              const allFolders = await request.get(testEndpoints.apiPublicFolder);
              const folderID = allFolders.body[1].id;

              const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
              const cardID = allCards.body[0].id;

              const score = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                Authorization: `Bearer ${jwts[2]}`,
              });

              expect(score.status).toBe(200);
              expect(score.body).toBe(6);

              const scoreCreate = await request
                .post(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString()))
                .set({
                  Authorization: `Bearer ${jwts[2]}`,
                })
                .send({ score: 10 });

              expect(scoreCreate.status).toBe(405);
              expect(scoreCreate.body.message).toBe(textCodes.SCOREALREADYEXISTS);
            });
          });

          describe("PUT", () => {
            it("PUT - We should update the score of the given card with So Mi's jwt, she has a score for this public folder.", async () => {
              const allFolders = await request.get(testEndpoints.apiPublicFolder);
              const folderID = allFolders.body[1].id;

              const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
              const cardID = allCards.body[0].id;

              const score = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                Authorization: `Bearer ${jwts[2]}`,
              });

              expect(score.status).toBe(200);
              expect(score.body).toBe(6);

              const scoreCreate = await request
                .put(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString()))
                .set({
                  Authorization: `Bearer ${jwts[2]}`,
                })
                .send({ score: 10 });

              expect(scoreCreate.status).toBe(200);
              expect(scoreCreate.body).toBe(10);
            });
            it("PUT - We shouldn't update the score of the given card with Solomon's jwt", async () => {
              const allFolders = await request.get(testEndpoints.apiPublicFolder);
              const folderID = allFolders.body[1].id;

              const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
              const cardID = allCards.body[0].id;

              const score = await request
                .put(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString()))
                .set({
                  Authorization: `Bearer ${jwts[0]}`, // Solomon's jwt
                })
                .send({ score: 10 });

              expect(score.status).toBe(404);
              expect(score.body.message).toBe(textCodes.NOSCOREFOUND);
            });
            describe("DELETE", () => {
              it("DELETE - We should delete the score of the given card with So Mi's jwt, she has a score for this public folder.", async () => {
                const allFolders = await request.get(testEndpoints.apiPublicFolder);
                const folderID = allFolders.body[1].id;

                const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
                const cardID = allCards.body[0].id;

                const score = await request.get(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                  Authorization: `Bearer ${jwts[2]}`,
                });

                expect(score.status).toBe(200);
                expect(score.body).toBe(6);

                const scoreCreate = await request.delete(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                  Authorization: `Bearer ${jwts[2]}`,
                });

                expect(scoreCreate.status).toBe(204);
              });
              it("DELETE - We shouldn't delete the score of the given card with Solomon's jwt", async () => {
                const allFolders = await request.get(testEndpoints.apiPublicFolder);
                const folderID = allFolders.body[1].id;

                const allCards = await request.get(testEndpoints.apiPublicCard.replace(":folderID", folderID.toString()));
                const cardID = allCards.body[0].id;

                const score = await request.delete(testEndpoints.apiPublicCardScore.replace(":folderID", folderID.toString()).replace(":cardID", cardID.toString())).set({
                  Authorization: `Bearer ${jwts[0]}`, // Solomon's jwt
                });

                expect(score.status).toBe(404);
                expect(score.body.message).toBe(textCodes.NOSCOREFOUND);
              });
            });
          });
        });
      });
    });
  });
});
