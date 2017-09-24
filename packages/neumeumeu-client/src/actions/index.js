import authentication from "./authentication";
import games from "./games";
import remote from "./remote";
import gameplay from "./gameplay";
import errors from "./errors";

export * from "./authentication";
export * from "./games";
export * from "./remote";
export * from "./gameplay";
export * from "./errors";

export default {
  ...authentication,
  ...games,
  ...remote,
  ...gameplay,
  ...errors,
};
