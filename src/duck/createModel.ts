import pick from 'lodash.pick';
import { useSelector } from 'react-redux';
import {
  createSlice,
  CreateSliceOptions,
  SliceCaseReducers,
  PayloadAction,
} from '@reduxjs/toolkit';
import { DeepPartial, WithOptional } from '../_type/util';

export interface ResetPayload<S> {
  /** 需要重置状态的字段列表 */
  keys: Array<keyof S>;
}

export type CreateModelOptions<State, CR extends SliceCaseReducers<State>> = WithOptional<
  CreateSliceOptions<State, CR, string>,
  'reducers'
>;

/**
 * 创建 Redux 状态模型
 */
export function createModel<
  State extends { [key: string]: any },
  CR extends SliceCaseReducers<State>
>({ name, initialState, reducers }: CreateModelOptions<State, CR>) {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      ...reducers,

      change: {
        reducer(state, { payload }: PayloadAction<Partial<State>>) {
          return { ...state, ...payload };
        },

        prepare(payload: Partial<State>) {
          return { payload };
        },
      },

      merge: {
        reducer(state, { payload }: PayloadAction<DeepPartial<State>>) {
          const mergedState = Object.keys(payload).reduce((ret, key) => {
            if (Array.isArray(payload[key])) {
              ret[key] = payload[key];
            } else if (typeof payload[key] === 'object' && payload[key]) {
              ret[key] = { ...(state[key] || {}), ...payload[key] };
            } else {
              ret[key] = payload[key];
            }
            return ret;
          }, {});

          return { ...state, ...mergedState };
        },

        prepare(payload: DeepPartial<State>) {
          return { payload };
        },
      },

      reset: {
        reducer(state, { payload }: PayloadAction<State>) {
          return {
            ...state,
            ...(payload?.keys ? pick(initialState, payload.keys) : initialState),
          };
        },

        prepare(payload?: ResetPayload<State>) {
          return { payload };
        },
      },
    },
  });

  /**
   * 获取 Model 状态
   * @param rootStateGetter 获取根状态的方法，通常是 `store.getState`
   */
  function selectState(rootStateGetter: () => any): State {
    return rootStateGetter()[name] || {};
  }

  /**
   * 获取 Model 状态 (React Hooks 版本)
   */
  function useState(): State {
    return useSelector(state => state[name]);
  }

  return { ...slice, selectState, useState };
}
