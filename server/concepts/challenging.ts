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
    await this.challenges.collection.updateOne({ _id }, { $set: { [`submissions.${outfit}`]: user } });
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
    if (challenge.winners.length === 3) {
      throw new NotAllowedError(`Challenge ${_id} already has 3 winners!`);
    }
    let winnerAlreadyPicked = false;
    if (challenge.winners.length > 0) {
      for (let w of challenge.winners) {
        if (w.toString() === winner.toString()) {
          winnerAlreadyPicked = true;
        }
      }
    }
    if (winnerAlreadyPicked) {
      throw new NotAllowedError(`User ${winner} is already a winner of challenge ${_id}!`);
    }
    await this.challenges.collection.updateOne({ _id }, { $push: { winners: winner } });
    return { msg: "Winner successfully added!" };
  }

  async removeChallengeWinner(_id: ObjectId, winner: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    let winnerIsWinner = false;
    for (let w of challenge.winners) {
      console.log(w.toString(), winner.toString());
      if (w.toString() === winner.toString()) {
        winnerIsWinner = true;
      }
    }
    if (!winnerIsWinner) {
      throw new NotAllowedError(`User ${winner} is not a winner of challenge ${_id}!`);
    }
    await this.challenges.collection.updateOne({ _id }, { $pull: { winners: winner } });
    return { msg: "Winner successfully removed!" };
  }

  async assertIsWinner(_id: ObjectId, winner: ObjectId) {
    const challenge = await this.challenges.readOne({ _id });
    if (!challenge) {
      throw new NotFoundError(`Challenge ${_id} does not exist!`);
    }
    if (challenge.winners.length > 0) {
      for (let w of challenge.winners) {
        if (w.toString() === winner.toString()) {
          return true;
        }
      }
    }
    return false;
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
