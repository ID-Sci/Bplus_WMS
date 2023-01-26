import {
  ACTION_PICKING,
  ACTION_PUTAWAY,
  ACTION_NEXTPICKING,
  ACTION_NEXTPUTAWAY,
  ACTION_NEXTJOB,
} from '../Constants';

const initialState = {
  Picking: [],
  PutAway: [],
  nextPicking: {},
  nextPutAway: {},
  nextJOB:{}
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
      case ACTION_NEXTJOB:
        return { ...state, nextJOB: payload }
    default:
      return state;
  }
};
export default dataReducer;