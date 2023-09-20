import React from 'react';
import { useNavigate } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { treinamentoApi } from '../../api/treinamentoApi';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import { Style } from './style/treinamentoListStyle';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import { PageLayout } from '../../../../ui/layouts/PageLayout';
import { IDefaultContainerProps, IDefaultListProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { ITreinamento } from '../../api/treinamentoSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { Box, Button } from '@mui/material';
import { getUser, userprofileData } from '/imports/libs/getUser';

interface ITreinamentoList extends IDefaultListProps {
	remove: (doc: ITreinamento) => void;
	viewComplexTable: boolean;
	setViewComplexTable: (_enable: boolean) => void;
	treinamentos: ITreinamento[];
	setFilter: (newFilter: Object) => void;
	clearFilter: () => void;
}

const TreinamentoList = (props: ITreinamentoList) => {
	const {
		treinamentos
	} = props;

	const navigate = useNavigate();
	const onClick = () => {
		navigate('/treinamento/');
	};

	return (
		<PageLayout title={'Atividades Recentes'} actions={[]}>
			{(
				<>
					<Box sx={Style.labelRegisterSystem}>
						<h1>
							<img src="/images/wireframe/logo.png" style={Style.imageLogo} />

						</h1>
						<h2>Bem vindo {getUser().username}</h2>
						<h3>
							<span>Seus Projetos muito mais organizados. Veja as tarefas editadas recentemente</span>
						</h3>
						<SimpleTable styles={{ border: '2px solid black' }}
							schema={_.pick(
								{
									...treinamentoApi.schema,
									nomeUsuario: { type: String, label: 'Criado por' }
								},
								['title', 'description', 'pessoal', 'check', 'nomeUsuario', 'lastupdate']
							)}
							data={treinamentos}
							onClick={() => { }}
						/>
						<Button sx={{ mt: 2, mb: 2 }} key={'b3'} color={'primary'} variant="contained" onClick={onClick}>Acessar Minhas Tarefas</Button>
					</Box>
				</>
			)}
		</PageLayout>
	);
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
	pageProperties: {
		currentPage: 1,
		pageSize: 25
	},
	sortProperties: { field: 'lastupdate', sortAscending: false },
	filter: {},
	searchBy: null,
	viewComplexTable: false
});

const treinamentoSearch = initSearch(
	treinamentoApi, // API
	subscribeConfig, // ReactiveVar subscribe configurations
	['title', 'description', 'pessoal', 'check', 'nomeUsuario', 'lastupdate'] // list of fields
);


const viewComplexTable = new ReactiveVar(false);

export const TreinamentoListContainer = withTracker(() => {

	//Reactive Search/Filter
	const config = subscribeConfig.get();
	const sort = {
		[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1
	};
	treinamentoSearch.setActualConfig(config);

	//Subscribe parameters
	const filter = { ...config.filter };
	// const filter = filtroPag;

	//Collection Subscribe
	const subHandle = treinamentoApi.subscribe('treinamentoListInicial', filter, {
		sort
	});
	const treinamentos = subHandle?.ready() ? treinamentoApi.find(filter, { sort }).fetch() : [];
	return {
		treinamentos,
		loading: !!subHandle && !subHandle.ready(),
		searchBy: config.searchBy,
		setSort: (sort = { field: 'lastupdate', sortAscending: true }) => {
			config.sortProperties = sort;
			subscribeConfig.set(config);
		}
	};
})(showLoading(TreinamentoList));
