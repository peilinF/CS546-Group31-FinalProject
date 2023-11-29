import * as pollData from "../data/polls.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { expect } from "chai";

let poll_id;



describe("poll function tests", async () => {
  it("create poll", async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const data = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll",
      description: "this is a new poll",
      options: ["opt1", "opt2", "opt3"],
    };

    const poll = await pollData.default.create(
      data.org_id,
      data.event_id,
      data.title,
      data.description,
      data.options
    );
    poll_id = poll._id;

    expect(poll.org_id).to.equal("1234567890");
    expect(poll.event_id).to.equal("1234567890");
    expect(poll.title).to.equal("new poll");
    expect(poll.description).to.equal("this is a new poll");
    expect(Array.isArray(poll.options.opt1)).to.equal(true);
    expect(Array.isArray(poll.options.opt2)).to.equal(true);
    expect(Array.isArray(poll.options.opt3)).to.equal(true);
  });

  // it("vote", async () => {
  //   const userId = "userId_000";

  //   const poll = await pollData.default.vote(userId, poll_id, "opt1");
  //   expect(poll.options.opt1[0]).to.equal(userId);
  // });

  it("Get all", async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const data1 = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll-1",
      description: "this is a new poll-1",
      options: ["opt1", "opt2", "opt3"],
    };

    const data2 = {
      org_id: "0987654321",
      event_id: "0987654321",
      title: "new poll-2",
      description: "this is a new poll-2",
      options: ["opt1", "opt2", "opt3"],
    };

    await pollData.default.create(
      data1.org_id,
      data1.event_id,
      data1.title,
      data1.description,
      data1.options
    );
    await pollData.default.create(
      data2.org_id,
      data2.event_id,
      data2.title,
      data2.description,
      data2.options
    );

    const poll = await pollData.default.getAll();
    const first_poll = poll[0];

    expect(first_poll.org_id).to.equal("1234567890");
    expect(first_poll.event_id).to.equal("1234567890");
    expect(first_poll.title).to.equal("new poll-1");
    expect(first_poll.description).to.equal("this is a new poll-1");
    expect(Array.isArray(first_poll.options.opt1)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt2)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt3)).to.equal(true);

    const second_poll = poll[1];

    expect(second_poll.org_id).to.equal("0987654321");
    expect(second_poll.event_id).to.equal("0987654321");
    expect(second_poll.title).to.equal("new poll-2");
    expect(second_poll.description).to.equal("this is a new poll-2");
    expect(Array.isArray(second_poll.options.opt1)).to.equal(true);
    expect(Array.isArray(second_poll.options.opt2)).to.equal(true);
    expect(Array.isArray(second_poll.options.opt3)).to.equal(true);

    await db.dropDatabase();
  });

  it("update poll", async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const data = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll",
      description: "this is a new poll",
      options: ["opt1", "opt2", "opt3"],
    };

    const poll = await pollData.default.create(
      data.org_id,
      data.event_id,
      data.title,
      data.description,
      data.options
    );
    poll_id = poll._id;

    const updateInfo = await pollData.default.update(
      data.org_id,
      data.poll_id,
      "updated poll",
      "this is an updated poll",
      data.options
    );

    expect(updateInfo.org_id).to.equal("1234567890");
    expect(updateInfo.title).to.equal("updated poll");
    expect(updateInfo.description).to.equal("this is an updated poll");
    expect(Array.isArray(poll.options.opt1)).to.equal(true);
    expect(Array.isArray(poll.options.opt2)).to.equal(true);
    expect(Array.isArray(poll.options.opt3)).to.equal(true);
    await db.dropDatabase();

  });
});

after(async () => {
  await closeConnection();
});