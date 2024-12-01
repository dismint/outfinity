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
    const _id = await this.challenges.createOne({ name, description, owner, closet, submissions: new Map(), active: true, requiredItem });
    return { msg: "Challenge successfully created!", challenge: await this.challenges.readOne({ _id }) };
  }

  async getChallenges() {
    // Returns all challenges!
    return await this.challenges.readMany({}, { sort: { _id: -1 } });
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
}

export class ChallengeOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly owner: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of challenge {1}!", owner, _id);
  }
}
