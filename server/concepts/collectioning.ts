import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CollectionDoc extends BaseDoc {
  name: string;
  emoji: string;
  owner: ObjectId;
  clothes: ObjectId[];
}

/**
 * concept: Collectioning [User, Clothing]
 */
export default class CollectioningConcept {
  public readonly collections: DocCollection<CollectionDoc>;

  /**
   * Make an instance of Collectioning.
   */
  constructor(collectionName: string) {
    this.collections = new DocCollection<CollectionDoc>(collectionName);
  }

  async create(name: string, emoji: string, owner: ObjectId) {
    if (!name) {
      throw new NotAllowedError("Closet name cannot be empty!");
    } else if (name === "main closet") {
      throw new NotAllowedError("Closet name cannot be 'main closet'!");
    }
    const _id = await this.collections.createOne({ name, emoji, owner, clothes: [] });
    return { msg: "Closet successfully created!", collection: await this.collections.readOne({ _id }) };
  }

  async getCollections() {
    // Returns all collections! You might want to page for better client performance
    return await this.collections.readMany({}, { sort: { _id: -1 } });
  }

  async getCollectionById(_id: ObjectId) {
    return await this.collections.readOne({ _id });
  }

  // return all the collections owned by user
  async getCollectionsByUser(user: ObjectId) {
    return await this.collections.readMany({ owner: user });
  }

  async getClothesInCollection(_id: ObjectId) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    return collection.clothes;
  }

  async addClothing(_id: ObjectId, clothing: ObjectId) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    //check if clothing already in collection
    for (const p of collection.clothes) {
      if (p.toString() === clothing.toString()) {
        return;
      }
    }
    collection.clothes.push(clothing);
    await this.collections.partialUpdateOne({ _id }, collection);
    return { msg: "Closet successfully updated!" };
  }

  async removeClothing(_id: ObjectId, clothing: ObjectId) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    collection.clothes = collection.clothes.filter((p) => p.toString() !== clothing.toString());
    await this.collections.partialUpdateOne({ _id }, collection);
    return { msg: "Closet successfully updated!" };
  }

  async deleteCollection(_id: ObjectId) {
    await this.collections.deleteOne({ _id });
    return { msg: "Closet successfully deleted!" };
  }

  async assertUserCanEditCollection(_id: ObjectId, user: ObjectId) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    if (collection.owner.toString() === user.toString()) {
      return;
    } else {
      throw new UserNotCollectionOwnerError(user, _id);
    }
  }
}

export class UserNotCollectionOwnerError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not allowed to edit collection {1}!", author, _id);
  }
}
