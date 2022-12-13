import { describe, beforeAll, afterAll, expect, it } from "vitest";
import User from "../../src/model/User.js";
import { faker } from "@faker-js/faker";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";

dotenv.config();

describe("Test User Schema & Model", () => {
  beforeAll(async () => {
    db.connect(process.env.DB_TEST_URI);
    await User.deleteMany({});
  });

  it("test create user", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const user = await User.create({ name, email });
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.id).toBeDefined();
  });

  describe("test name is required", () => {
    it("test name is null", async () => {
      try {
        const name = null;
        const email = faker.internet.email();
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is undefined", async () => {
      try {
        const name = undefined;
        const email = faker.internet.email();
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is empty", async () => {
      try {
        const name = "";
        const email = faker.internet.email();
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test email is required", () => {
    it("test email is null", async () => {
      try {
        const name = faker.name.fullName();
        const email = null;
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is undefined", async () => {
      try {
        const name = faker.name.fullName();
        const email = undefined;
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is empty", async () => {
      try {
        const name = faker.name.fullName();
        const email = "";
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is invalid", async () => {
      try {
        const name = faker.name.fullName();
        const email = faker.lorem.sentence();
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is not unique", async () => {
      try {
        let name = faker.name.fullName();
        const email = faker.internet.email();
        await User.create({ name, email });

        name = faker.name.fullName();
        await User.create({ name, email });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
});
