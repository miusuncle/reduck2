import { SliceCaseReducers } from '@reduxjs/toolkit';
import { WithOptional } from '../_type/util';
import { createModel, CreateModelOptions } from './createModel';

export type CreateDuckOptions<
	State,
	CR extends SliceCaseReducers<State>,
	Actions extends { [key: string]: (...args: any) => any }
> = WithOptional<CreateModelOptions<State, CR>, 'reducers'> & {
	actions?: Actions;
};

/**
 * 创建 Redux Duck
 */
export function createDuck<
	State extends { [key: string]: any },
	CR extends SliceCaseReducers<State>,
	Actions extends { [key: string]: (...args: any) => any }
>({ name, initialState, reducers, actions }: CreateDuckOptions<State, CR, Actions>) {
	const model = createModel({ name, initialState, reducers });

	return {
		name: model.name,
		reducer: model.reducer,
		useState: model.useState,
		selectState: model.selectState,
		...model.actions,
		...actions,
	};
}
