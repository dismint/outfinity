import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import SessioningConcept from "./concepts/sessioning";
import CollectioningConcept from "./concepts/collectioning";
import ClothingConcept from "./concepts/clothing";
import ChallengingConcept from "./concepts/challenging";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Closeting = new CollectioningConcept("closets");
export const Outfiting = new CollectioningConcept("outfits");
export const Clothing = new ClothingConcept("clothes");
export const Challenging = new ChallengingConcept("challenges");
