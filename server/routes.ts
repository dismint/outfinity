import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Challenging, Closeting, Clothing, Friending, Outfiting, Posting, Sessioning } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    const newuser = await Authing.create(username, password);
    if (!newuser.user) {
      throw new Error("User creation failed");
    }
    const userId = newuser.user._id;
    await Closeting.create("main", " ", userId);
    return newuser;
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  @Router.get("/clothes")
  async getClothingById(session: SessionDoc, id: string) {
    // const user = Sessioning.getUser(session);
    // const result = await Clothing.addClothing(type, name, description, imgUrl, user);
    // const main = await Closeting.getClosetByUserAndName(user, "main");
    // await Closeting.addClothing(main._id, new ObjectId(result.id));
    return Clothing.getClothingInformation(new ObjectId(id));
  }

  @Router.post("/clothes")
  async createClothes(session: SessionDoc, name: string, description: string, imgUrl: string, type: string) {
    const user = Sessioning.getUser(session);
    const result = await Clothing.addClothing(type, name, description, imgUrl, user);
    const main = await Closeting.getClosetByUserAndName(user, "main");
    await Closeting.addClothing(main._id, new ObjectId(result.id));
    return result;
  }

  @Router.delete("/clothes/:id")
  async deleteClothes(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Clothing.removeClothing(new ObjectId(id), user);
    const allClosets = await Closeting.getCollectionsItemIn(new ObjectId(id));
    for (const clo in allClosets) {
      await Closeting.removeClothing(allClosets[clo]._id, new ObjectId(id));
    }
    return { msg: "Clothing removed!" };
    // TODO: delete all outfits containing this clothing
  }

  @Router.post("/closets")
  async createCloset(session: SessionDoc, name: string, emoji: string) {
    const user = Sessioning.getUser(session);
    return await Closeting.create(name, emoji, user);
  }

  @Router.get("/closets/byname")
  @Router.validate(z.object({ user: z.string().min(1), name: z.string().min(1) }))
  async getClosetByUserAndName(user: string, name: string) {
    return await Closeting.getClosetByUserAndName(new ObjectId(user), name);
  }

  @Router.get("/closets/:id/search/:keyword")
  @Router.validate(z.object({ keyword: z.string() }))
  async searchClosetByKeyword(id: string, keyword: string) {
    const collection = await Closeting.getClothesInCollection(new ObjectId(id));
    const clothes = [];
    for (const p of collection) {
      if (await Clothing.assertClothingHasKeyword(new ObjectId(p), keyword)) {
        clothes.push(p);
      }
    }
    return clothes;
  }

  @Router.get("/closets/:id/filter/:type")
  @Router.validate(z.object({ type: z.string() }))
  async filterClosetByType(session: SessionDoc, id: string, type: string) {
    const user = Sessioning.getUser(session);
    const clothes = await Clothing.searchClothingByType(type, user);
    const clothingIds = [];
    for (const p of clothes) {
      clothingIds.push(p._id);
    }
    return await Closeting.filterInCollection(new ObjectId(id), clothingIds);
  }

  @Router.get("/users/:userid/closets/:id/searchandfilter")
  async searchAndFilterCloset(userid: string, id: string, keyword?: string, type?: string) {
    const user = new ObjectId(userid);
    let clothes = [];
    if (type && keyword) {
      clothes = await Clothing.searchAndFilter(type, keyword, user);
    } else if (type) {
      clothes = await Clothing.searchClothingByType(type, user);
    } else if (keyword) {
      clothes = await Clothing.searchClothingByKeyword(keyword, user);
    } else {
      clothes = await Clothing.searchClothingByOwner(user);
    }
    const clothingIds = [];
    for (const p of clothes) {
      clothingIds.push(p._id);
    }
    const result = await Closeting.filterInCollection(new ObjectId(id), clothingIds);
    return result;
  }

  @Router.get("/clothing/:id/closets")
  async getClosetsWithClothing(id: string) {
    return await Closeting.getCollectionsItemIn(new ObjectId(id));
  }

  @Router.get("/closets/user")
  @Router.validate(z.object({ id: z.string().optional() }))
  async getClosetByUser(id?: string) {
    let collections;
    if (id) {
      collections = await Closeting.getCollectionsByUser(new ObjectId(id));
    } else {
      collections = await Closeting.getCollections();
    }
    return collections;
  }

  @Router.get("/closets/:id")
  async getClosetsById(id: string) {
    return await Closeting.getCollectionById(new ObjectId(id));
  }

  @Router.get("/closets/:id/clothes")
  async getClothingInCloset(id: string) {
    return await Closeting.getClothesInCollection(new ObjectId(id));
  }

  // @Router.patch("/closets/:id/addClothing/:clothingId")
  // async addClothingToCloset(session: SessionDoc, id: string, clothingId: string) {
  //   const user = Sessioning.getUser(session);
  //   await Clothing.assertClothingExists(new ObjectId(clothingId));
  //   await Closeting.assertUserCanEditCollection(new ObjectId(id), user);
  //   return await Closeting.addClothing(new ObjectId(id), new ObjectId(clothingId));
  // }

  @Router.patch("/closets/:id/add")
  async bulkAddClothingToCloset(session: SessionDoc, id: string, clothes: string[]) {
    const user = Sessioning.getUser(session);
    await Closeting.assertUserCanEditCollection(new ObjectId(id), user);
    for (const p of clothes) {
      await Clothing.assertClothingExists(new ObjectId(p));
    }
    return await Closeting.bulkAddClothing(
      new ObjectId(id),
      clothes.map((p) => new ObjectId(p)),
    );
  }

  @Router.patch("/closets/:id/remove")
  async bulkRemoveClothingFromCloset(session: SessionDoc, id: string, clothes: string[]) {
    const user = Sessioning.getUser(session);
    await Closeting.assertUserCanEditCollection(new ObjectId(id), user);
    for (const p of clothes) {
      await Clothing.assertClothingExists(new ObjectId(p));
    }
    return await Closeting.bulkRemoveClothing(
      new ObjectId(id),
      clothes.map((p) => new ObjectId(p)),
    );
  }

  // @Router.patch("/closets/:id/removeClothing/:clothingId")
  // async removeClothingFromCloset(session: SessionDoc, id: string, clothingId: string) {
  //   const user = Sessioning.getUser(session);
  //   await Clothing.assertClothingExists(new ObjectId(clothingId));
  //   await Closeting.assertUserCanEditCollection(new ObjectId(id), user);
  //   return await Closeting.removeClothing(new ObjectId(id), new ObjectId(clothingId));
  // }

  @Router.delete("/closets/:id")
  async deleteCloset(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Closeting.assertUserCanEditCollection(new ObjectId(id), user);
    return await Closeting.deleteCollection(new ObjectId(id));
  }

  // @Router.post("/outfits")
  // async createOutfit(session: SessionDoc, name: string, description: string) {
  //   const user = Sessioning.getUser(session);
  //   return await Outfiting.create(name, description, user);
  // }

  @Router.get("/outfits/search/:keyword")
  @Router.validate(z.object({ keyword: z.string() }))
  async searchForOutfitsByKeyword(id: string, keyword: string) {
    //get all outfits that have this keyword in its name or description
    return await Outfiting.searchCollectionsByKeyword(keyword);
  }

  // @Router.get("/outfits/user")
  // @Router.validate(z.object({ id: z.string().optional() }))
  // async getOutfitsByUser(id?: string) {
  //   let collections;
  //   if (id) {
  //     collections = await Outfiting.getCollectionsByUser(new ObjectId(id));
  //   } else {
  //     collections = await Outfiting.getCollections();
  //   }
  //   return collections;
  // }

  @Router.get("/outfits/:id")
  async getOutfitById(id: string) {
    return await Outfiting.getCollectionById(new ObjectId(id));
  }

  @Router.get("/outfits/:id/clothes")
  async getClothingInOutfit(id: string) {
    return await Outfiting.getClothesInCollection(new ObjectId(id));
  }

  @Router.get("/clothing/:id/closets")
  async getOutfitsWithClothing(id: string) {
    return await Outfiting.getCollectionsItemIn(new ObjectId(id));
  }

  @Router.post("/outfits")
  async createOutfitWithClothes(session: SessionDoc, name: string, description: string, clothes: string[]) {
    const user = Sessioning.getUser(session);
    const clothingTypes: string[] = [];
    for (const p of clothes) {
      await Clothing.assertClothingExists(new ObjectId(p));
      const item = await Clothing.getClothingInformation(new ObjectId(p));
      if (item) {
        clothingTypes.push(item.type);
      }
    }
    await Outfiting.assertOutfitIsValid(clothingTypes);
    const outfitId = await Outfiting.create(name, description, user);
    if (outfitId === null || outfitId.collection === null) {
      return { msg: "Outfit creation failed!" };
    } else {
      for (const p of clothes) {
        await Outfiting.addClothing(new ObjectId(outfitId.collection._id), new ObjectId(p));
      }
      return { msg: "Outfit created successfully!", collection: outfitId.collection };
    }
  }

  // @Router.patch("/outfits/:id/addClothing/:clothingId")
  // async addClothingToOutfit(session: SessionDoc, id: string, clothingId: string) {
  //   const user = Sessioning.getUser(session);
  //   await Clothing.assertClothingExists(new ObjectId(clothingId));
  //   await Outfiting.assertUserCanEditCollection(new ObjectId(id), user);
  //   return await Outfiting.addClothing(new ObjectId(id), new ObjectId(clothingId));
  // }

  // @Router.patch("/outfits/:id/removeClothing/:clothingId")
  // async removeClothingFromOutfit(session: SessionDoc, id: string, clothingId: string) {
  //   const user = Sessioning.getUser(session);
  //   await Clothing.assertClothingExists(new ObjectId(clothingId));
  //   await Outfiting.assertUserCanEditCollection(new ObjectId(id), user);
  //   return await Outfiting.removeClothing(new ObjectId(id), new ObjectId(clothingId));
  // }

  @Router.delete("/outfits/:id")
  async deleteOutfit(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Outfiting.assertUserCanEditCollection(new ObjectId(id), user);
    return await Outfiting.deleteCollection(new ObjectId(id));
  }

  @Router.patch("/outfits/save/:id")
  async saveOutfit(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    return await Outfiting.saveCollection(new ObjectId(id), user);
  }

  @Router.patch("/outfits/unsave/:id")
  async unsaveOutfit(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    return await Outfiting.unsaveCollection(new ObjectId(id), user);
  }

  @Router.get("/outfits")
  async getSavedOutfits(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Outfiting.getUserSavedCollections(user);
  }

  @Router.get("/outfit/:id/saved")
  async isOutfitSaved(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    return await Outfiting.isCollectionSaved(new ObjectId(id), user);
  }

  @Router.get("/challenges")
  async getChallenges() {
    return await Challenging.getChallenges();
  }

  @Router.get("/challenges/:id")
  async getChallengeById(id: string) {
    return await Challenging.getChallengeById(new ObjectId(id));
  }

  @Router.get("/challenges/owner/:owner")
  @Router.validate(z.object({ owner: z.string().min(1) }))
  async getByOwner(owner: string) {
    return await Challenging.getByOwner(new ObjectId(owner));
  }

  @Router.post("/challenges")
  async createChallenge(session: SessionDoc, name: string, description: string, closetId: string) {
    const user = Sessioning.getUser(session);
    const clothingTypes = [];
    const clothes = await Closeting.getClothesInCollection(new ObjectId(closetId));
    for (const p of clothes) {
      const item = await Clothing.getClothingInformation(p);
      if (item) {
        clothingTypes.push(item.type);
      }
    }
    await Closeting.assertClosetIsValid(clothingTypes);
    return await Challenging.create(name, description, user, new ObjectId(closetId), null);
  }

  @Router.patch("/challenges/:id/participate")
  async participate(session: SessionDoc, id: string, name: string, description: string, clothes: string[]) {
    const user = Sessioning.getUser(session);
    const clothingTypes: string[] = [];
    for (let i = 0; i < clothes.length; i++) {
      const p = clothes[i];
      await Clothing.assertClothingExists(new ObjectId(p));
      const item = await Clothing.getClothingInformation(new ObjectId(p));
      if (item) {
        clothingTypes.push(item.type);
      }
    }
    await Outfiting.assertOutfitIsValid(clothingTypes);
    const outfit = await Outfiting.create(name, description, user);
    const outfitId = outfit.collection?._id;
    if (!outfitId) {
      throw new Error("Outfit creation failed!");
    }
    for (let i = 0; i < clothes.length; i++) {
      const p = clothes[i];
      await Outfiting.addClothing(new ObjectId(outfitId), new ObjectId(p));
    }
    return await Challenging.participate(new ObjectId(id), user, outfitId);
  }

  @Router.patch("/challenges/:id/end")
  async endChallenge(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Challenging.assertOwnerIsUser(new ObjectId(id), user);
    return await Challenging.endChallenge(new ObjectId(id));
  }

  @Router.patch("/challenges/:id/winner")
  async pickWinner(session: SessionDoc, id: string, winner: string) {
    const user = Sessioning.getUser(session);
    await Challenging.assertOwnerIsUser(new ObjectId(id), user);
    return await Challenging.addChallengeWinner(new ObjectId(id), new ObjectId(winner));
  }

  @Router.get("/challenges/:id/submissions")
  async getChallengeSubmissions(id: string) {
    return await Challenging.getChallengeSubmissions(new ObjectId(id));
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
