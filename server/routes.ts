import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Friending, Posting, Sessioning, Collectioning, Clothing } from "./app";
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
    return await Authing.create(username, password);
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

  @Router.post("/closets")
  async createCollection(session: SessionDoc, name: string, emoji: string) {
    const user = Sessioning.getUser(session);
    return await Collectioning.create(name, emoji, user);
  }

  @Router.get("/closets/:id/search/:keyword")
  @Router.validate(z.object({ keyword: z.string() }))
  async searchCloset(id: string, keyword: string) {
    const collection = await Collectioning.getClothesInCollection(new ObjectId(id));
    const clothes = [];
    for (const p of collection) {
      if (await Clothing.assertClothingHasKeyword(new ObjectId(p), keyword)) {
        clothes.push(p);
      }
    }
    return clothes;
  }

  @Router.get("/closets/user/:id")
  async getCollectionsByUser(id: string) {
    let collections;
    if (id) {
      collections = await Collectioning.getCollectionsByUser(new ObjectId(id));
    } else {
      collections = await Collectioning.getCollections();
    }
    return collections;
  }

  @Router.get("/closets/:id")
  async getCollectionById(id: string) {
    return await Collectioning.getCollectionById(new ObjectId(id));
  }

  @Router.get("/closets/:id/clothes")
  async getClothingInCollection(id: string) {
    return await Collectioning.getClothesInCollection(new ObjectId(id));
  }

  @Router.patch("/closets/:id/addClothing/:clothingId")
  async addClothingToCollection(session: SessionDoc, id: string, clothingId: string) {
    const user = Sessioning.getUser(session);
    await Clothing.assertClothingExists(new ObjectId(clothingId));
    await Collectioning.assertUserCanEditCollection(new ObjectId(id), user);
    return await Collectioning.addClothing(new ObjectId(id), new ObjectId(clothingId));
  }

  @Router.patch("/closets/:id/removeClothing/:clothingId")
  async removeClothingFromCollection(session: SessionDoc, id: string, clothingId: string) {
    const user = Sessioning.getUser(session);
    await Clothing.assertClothingExists(new ObjectId(clothingId));
    await Collectioning.assertUserCanEditCollection(new ObjectId(id), user);
    return await Collectioning.removeClothing(new ObjectId(id), new ObjectId(clothingId));
  }

  @Router.delete("/collections/:id")
  async deleteCollection(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Collectioning.assertUserCanEditCollection(new ObjectId(id), user);
    return await Collectioning.deleteCollection(new ObjectId(id));
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
