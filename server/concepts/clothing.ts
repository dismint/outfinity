import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ClothingDoc extends BaseDoc {
  type: string;
  name: string;
  description: string;
  numWears: number;
  imgUrl: string;
  owner: ObjectId;
}

/**
 * concept: Clothing
 */
export default class ClothingConcept {
  public readonly clothes: DocCollection<ClothingDoc>;

  /**
   * Make an instance of Clothing.
   */
  constructor(collectionName: string) {
    this.clothes = new DocCollection<ClothingDoc>(collectionName);
    void this.clothes.collection.createIndex({ type: 1 });
  }

  async addClothing(type: string, name: string, description: string, imgUrl: string, owner: ObjectId) {
    await this.assertTypeValid(type);
    const _id = await this.clothes.createOne({ type, name, description, numWears: 0, imgUrl, owner });
    return { msg: "Clothing added successfully!", id: _id };
  }

  async getClothes(user: ObjectId) {
    return await this.clothes.readMany({ owner: user }, { sort: { _id: -1 } });
  }

  async removeClothing(_id: ObjectId, owner: ObjectId) {
    await this.assertClothingExists(_id);
    await this.assertIsOwner(_id, owner);
    await this.clothes.deleteOne({ _id });
    return { msg: "Clothing removed!" };
  }

  async wearClothing(_id: ObjectId, owner: ObjectId) {
    await this.assertClothingExists(_id);
    await this.assertIsOwner(_id, owner);
    await this.clothes.collection.updateOne({ _id }, { $inc: { numWears: 1 } });
    return { msg: "Clothing worn successfully!" };
  }

  async getClothingInformation(_id: ObjectId) {
    return await this.clothes.readOne({ _id });
  }

  async searchClothingByType(type: string, owner: ObjectId) {
    await this.assertTypeValid(type);
    return await this.clothes.readMany({ type, owner });
  }

  async searchClothingByOwner(owner: ObjectId) {
    return await this.clothes.readMany({ owner });
  }

  async searchClothingByKeyword(keyword: string, owner: ObjectId) {
    const nameMatches = await this.clothes.readMany({ name: { $regex: keyword, $options: "i" }, owner });
    const descriptionMatches = await this.clothes.readMany({ description: { $regex: keyword, $options: "i" }, owner });
    const allMatches = nameMatches.concat(descriptionMatches);
    return allMatches.filter((clothes, index, self) => self.findIndex((c) => c._id.toString() === clothes._id.toString()) === index);
  }

  async searchAndFilter(type: string, keyword: string, owner: ObjectId) {
    await this.assertTypeValid(type);
    const typeMatches = await this.searchClothingByType(type, owner);
    const keywordMatches = await this.searchClothingByKeyword(keyword, owner);
    const allMatches = typeMatches.filter((value) => keywordMatches.some((item) => item._id.toString() === value._id.toString()));
    return allMatches.filter((clothes, index, self) => self.findIndex((c) => c._id.toString() === clothes._id.toString()) === index);
  }

  async assertClothingHasKeyword(_id: ObjectId, keyword: string) {
    const clothing = await this.clothes.readOne({ _id });
    if (!clothing) {
      throw new ClothingNotFoundError(_id);
    }
    if (!clothing.name.includes(keyword) && !clothing.description.includes(keyword)) {
      return false;
    } else {
      return true;
    }
  }

  async assertClothingExists(_id: ObjectId) {
    const maybeClothing = await this.clothes.readOne({ _id });
    if (!maybeClothing) {
      throw new ClothingNotFoundError(_id);
    }
  }

  private async assertIsOwner(_id: ObjectId, owner: ObjectId) {
    const maybeClothing = await this.clothes.readOne({ _id });
    if (!maybeClothing) {
      throw new ClothingNotFoundError(_id);
    }
    if (maybeClothing.owner.toString() !== owner.toString()) {
      throw new NotAllowedError(`You do not own this clothing!`);
    }
  }

  private async assertTypeValid(type: string) {
    if (!["top", "bottom", "shoe", "hat", "onepiece"].includes(type)) {
      throw new NotAllowedError(`Invalid clothing type!`);
    }
  }
}

export class ClothingNotFoundError extends NotFoundError {
  constructor(public readonly _id: ObjectId) {
    super(`The clothing item you are trying to access does not exist!`);
  }
}
