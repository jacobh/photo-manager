import { rawToWebp } from "../utils/imageConversion";

export const CREATE_PHOTO = "CREATE_PHOTO";
export const ADD_PHOTO_PREVIEW = "ADD_PHOTO_PREVIEW";

export function createPhoto(hash, path) {
  return {
    type: CREATE_PHOTO,
    data: { hash, path }
  };
}

export function generateOriginalPreview(hash) {
  return async (dispatch, getState) => {
    const currentState = getState().photos;
    const rawPath = currentState.getIn([hash, "path"]);
    const webpPath = await rawToWebp(rawPath);
    dispatch({
      type: ADD_PHOTO_PREVIEW,
      data: { hash, size: "original", path: webpPath }
    });
  };
}
