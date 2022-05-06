import {
  ACTION_PICKING,
  ACTION_PUTAWAY,
  ACTION_NEXTPICKING,
  ACTION_NEXTPUTAWAY,
} from '../Constants';

const initialState = {
  Picking: [],
  PutAway: [],
  nextPicking: {},
  nextPutAway: {},
}

const dataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_PICKING:
      return { ...state, Picking: payload }
    case ACTION_PUTAWAY:
      return { ...state, PutAway: payload }
    case ACTION_NEXTPICKING:
      return { ...state, nextPicking: payload }
    case ACTION_NEXTPUTAWAY:
      return { ...state, nextPutAway: payload }
    default:
      return state;
  }
};
export default dataReducer;