import { copyArray } from "common/utils";

const DEFAULT_STATE = [];

function addErrorMessage(state, message) {
  return state.concat(message);
}

function popLastErrorMessage(state) {
  const newState = copyArray(state);
  newState.shift();
  return newState;
}

export default function errors(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case "ADD_ERROR_MESSAGE":
      return addErrorMessage(state, action.message);
    case "POP_LAST_ERROR_MESSAGE":
      return popLastErrorMessage(state);
    default:
      return state;
  }
}
