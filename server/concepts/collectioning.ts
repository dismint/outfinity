import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CollectionDoc extends BaseDoc {
  name: string;
  description: string;
  owner: ObjectId;
  clothes: ObjectId[];
  saved: boolean;
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

  async create(name: string, description: string, owner: ObjectId) {
    await this.assertValidClosetName(owner, name);
    const _id = await this.collections.createOne({ name, description, owner, clothes: [], saved: false });
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

  async getClosetByUserAndName(user: ObjectId, name: string) {
    const closet = await this.collections.readOne({ name: name, owner: user });
    if (!closet) {
      throw new NotFoundError("Closet does not exist!");
    }
    return closet;
  }

  async getCollectionsItemIn(_id: ObjectId) {
    return await this.collections.readMany({ clothes: _id });
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

  async bulkAddClothing(_id: ObjectId, clothing: ObjectId[]) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    for (const p of clothing) {
      let add = true;
      //check if clothing already in collection
      for (const c of collection.clothes) {
        if (p.toString() === c.toString()) {
          add = false;
        }
      }
      if (add) {
        collection.clothes.push(p);
      }
    }
    await this.collections.partialUpdateOne({ _id }, { clothes: collection.clothes });
    return { msg: "Closet successfully updated!" };
  }

  async bulkRemoveClothing(_id: ObjectId, clothing: ObjectId[]) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    for (const p of clothing) {
      collection.clothes = collection.clothes.filter((c) => c.toString() !== p.toString());
    }
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

  async filterInCollection(_id: ObjectId, clothing: ObjectId[]) {
    // return all the items in clothing that are in the collection _id
    const collection = await this.collections.readOne({ _id });
    const filtered = [];
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    for (const p of clothing) {
      for (const c of collection.clothes) {
        if (p.toString() === c.toString()) {
          filtered.push(p);
        }
      }
    }
    return filtered;
  }

  async deleteCollection(_id: ObjectId) {
    await this.collections.deleteOne({ _id });
    return { msg: "Closet successfully deleted!" };
  }

  async saveCollection(_id: ObjectId) {
    await this.collections.partialUpdateOne({ _id }, { saved: true });
    return { msg: "Outfit successfully saved!" };
  }

  async unsaveCollection(_id: ObjectId) {
    await this.collections.partialUpdateOne({ _id }, { saved: false });
    return { msg: "Outfit successfully unsaved!" };
  }

  async getUserSavedCollections(user: ObjectId) {
    return await this.collections.readMany({ owner: user, saved: true });
  }

  async isCollectionSaved(_id: ObjectId) {
    const collection = await this.collections.readOne({ _id });
    if (!collection) {
      throw new NotFoundError(`Collection ${_id} does not exist!`);
    }
    return collection.saved;
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

  async searchCollectionsByKeyword(keyword: string) {
    //if either the name or the description matches the keyword, return the collection
    const nameMatches = await this.collections.readMany({ name: { $regex: keyword, $options: "i" } });
    const descriptionMatches = await this.collections.readMany({ description: { $regex: keyword, $options: "i" } });
    const allMatches = nameMatches.concat(descriptionMatches);
    return allMatches.filter((collection, index, self) => self.findIndex((c) => c._id.toString() === collection._id.toString()) === index);
  }

  async assertValidClosetName(owner: ObjectId, name: string) {
    if (!name) {
      throw new NotAllowedError("Closet name cannot be empty!");
    }
    if (await this.collections.readOne({ owner, name })) {
      throw new NotAllowedError(`Closet with name ${name} already exists!`);
    }
  }

  async assertClosetIsValid(array: string[]) {
    //check that the array has at least one "top", one "bottom", and one "shoe"
    let top = false;
    let bottom = false;
    let shoe = false;
    for (const p of array) {
      if (p === "top") {
        top = true;
      } else if (p === "bottom") {
        bottom = true;
      } else if (p === "shoe") {
        shoe = true;
      }
    }
    if (!top || !bottom || !shoe) {
      throw new NotAllowedError("Closet must contain at least one top, one bottom, and one shoe!");
    }
  }

  async assertOutfitIsValid(array: string[]) {
    //check that the array has at least one "top", one "bottom", and exactly one "shoe"
    let top = false;
    let bottom = false;
    let shoe = false;
    let onepiece = false;
    for (const p of array) {
      if (p === "top") {
        top = true;
      } else if (p === "bottom") {
        bottom = true;
      } else if (p === "shoe") {
        if (shoe) {
          throw new NotAllowedError("Closet must contain exactly one shoe!");
        }
        shoe = true;
      } else if (p === "onepiece") {
        onepiece = true;
      }
    }
    if ((!top || !bottom || !shoe) && (!onepiece || !shoe)) {
      throw new NotAllowedError("Closet must contain at least one top, one bottom, and one shoe, or one one-piece and one shoe!");
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
