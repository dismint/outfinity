import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ChallengeDoc extends BaseDoc {
  owner: ObjectId;
  closet: ObjectId;
  name: string;
  description: string;
  submissions: Map<ObjectId, ObjectId>; // Map<outfit, user>
  active: boolean;
  requiredItem: ObjectId | null;
  winners: ObjectId[];
}

/**
 * concept: Challenging [Collection, Item, Submission, User]
 */
export default class ChallengingConcept {
  public readonly challenges: DocCollection<ChallengeDoc>;

  /**
   * Make an instance of Challenging.
   */
  constructor(name: string) {
    this.challenges = new DocCollection<ChallengeDoc>(name);
  }

  async create(name: string, description: string, owner: ObjectId, closet: ObjectId, requiredItem: ObjectId | null) {
    const _id = await this.challenges.createOne({ name, description, owner, closet, submissions: new Map(), active: true, requiredItem, winners: [] });
    return { msg: "Challenge successfully created!", challenge: await this.challenges.readOne({ _id }) };
  }

  async getChallenges() {
    // Returns all challenges!
    return await this.challenges.readMany({}, { sort: { _id: -1 } });
  }

  async getChallengeById(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge;
  }

  async getByOwner(owner: ObjectId) {
    return await this.challenges.readMany({ owner });
  }

  async participate(_id: ObjectId, user: ObjectId, outfit: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    if (!challenge.active) {
      throw new NotAllowedError(`Challenge ${_id} is not active!`);
    }
    challenge.submissions.set(outfit, user);
    await this.challenges.collection.updateOne({ _id }, { submissions: challenge.submissions });
    return { msg: "Participation successful!" };
  }

  async endChallenge(_id: ObjectId) {
    await this.challenges.collection.updateOne({ _id }, { $set: { active: false } });
    return { msg: "Challenge ended!" };
  }

  async assertOwnerIsUser(_id: ObjectId, user: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    if (challenge.owner.toString() !== user.toString()) {
      throw new ChallengeOwnerNotMatchError(user, _id);
    }
  }

  async getChallengeCloset(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge.closet;
  }

  async getChallengeMustHaveItem(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge.requiredItem;
  }

  async getChallengeSubmissions(_id: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    return challenge.submissions;
  }

  async addChallengeWinner(_id: ObjectId, winner: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    let winnerDidChallenge = false;
    for (const user of challenge.submissions.values()) {
      if (user.toString() === winner.toString()) {
        winnerDidChallenge = true;
      }
    }
    if (!winnerDidChallenge) {
      throw new NotAllowedError(`User ${winner} did not participate in challenge ${_id}!`);
    }
    if (challenge.winners.length === 3) {
      throw new NotAllowedError(`Challenge ${_id} already has 3 winners!`);
    }
    let winnerAlreadyPicked = false;
    for (const w of challenge.winners) {
      if (w.toString() === winner.toString()) {
        winnerAlreadyPicked = true;
      }
    }
    if (winnerAlreadyPicked) {
      throw new NotAllowedError(`User ${winner} is already a winner of challenge ${_id}!`);
    }
    challenge.winners.push(winner);
    await this.challenges.collection.updateOne({ _id }, { winners: challenge.winners });
    return { msg: "Winner successfully added!" };
  }

  async removeChallengeWinner(_id: ObjectId, winner: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    let winnerIsWinner = false;
    for (const w of challenge.winners) {
      if (w.toString() === winner.toString()) {
        winnerIsWinner = true;
      }
    }
    if (!winnerIsWinner) {
      throw new NotAllowedError(`User ${winner} is not a winner of challenge ${_id}!`);
    }
    challenge.winners = challenge.winners.filter((w) => w.toString() !== winner.toString());
    await this.challenges.collection.updateOne({ _id }, { winners: challenge.winners });
    return { msg: "Winner successfully removed!" };
  }
}

export class ChallengeOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly owner: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of challenge {1}!", owner, _id);
  }
}
