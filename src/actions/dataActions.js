import {
  ACTION_PICKING,
  ACTION_PUTAWAY,
  ACTION_NEXTPICKING,
  ACTION_NEXTPUTAWAY,
} from '../Constants';

export const setPicking = (payload) => ({
  type: ACTION_PICKING,
  payload,
})
export const setPutAway = (payload) => ({
  type: ACTION_PUTAWAY,
  payload,
})
export const setNextPicking = (payload) => ({
  type: ACTION_NEXTPICKING,
  payload,
})
export const setNextPutAway = (payload) => ({
  type: ACTION_NEXTPUTAWAY,
  payload,
})