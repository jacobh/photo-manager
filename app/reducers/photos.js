import Immutable from "immutable";
import { CREATE_PHOTO, ADD_PHOTO_PREVIEW } from "../actions/photos";

export default function photos(state = Immutable.Map(), action) {
  switch (action.type) {
    case CREATE_PHOTO:
      return state.set(action.data.hash, Immutable.Map(action.data));
    case ADD_PHOTO_PREVIEW:
      return state.setIn(
        [action.data.hash, `${action.data.size}Path`],
        action.data.path
      );
    default:
      return state;
  }
}
