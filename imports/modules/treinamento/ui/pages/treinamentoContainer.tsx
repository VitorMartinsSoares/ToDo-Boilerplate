import React from 'react';
import { TreinamentoListContainer } from './treinamentoList';
import { TreinamentoDetailContainer } from './treinamentoDetail';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';

export default (props: IDefaultContainerProps) => {
	const validState = ['view', 'edit', 'create'];

	let { screenState, treinamentoId } = useParams();

	const state = screenState ? screenState : props.screenState;

	const id = treinamentoId ? treinamentoId : props.id;

	if (!!state && validState.indexOf(state) !== -1) {
		if (state === 'view' && !!id) {
			return <TreinamentoDetailContainer {...props} screenState={state} id={id} />;
		} else if (state === 'edit' && !!id) {
			return <TreinamentoDetailContainer {...props} screenState={state} id={id} {...{ edit: true }} />;
		} else if (state === 'create') {
			return <TreinamentoDetailContainer {...props} screenState={state} id={id} {...{ create: true }} />;
		}
	} else {
		return <TreinamentoListContainer {...props} />;
	}
};
