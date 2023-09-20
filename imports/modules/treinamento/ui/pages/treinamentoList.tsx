import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { treinamentoApi } from '../../api/treinamentoApi';
import { userprofileApi } from '../../../../userprofile/api/UserProfileApi';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import * as appStyle from '/imports/materialui/styles';
import { nanoid } from 'nanoid';
import { PageLayout } from '../../../../ui/layouts/PageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SearchDocField from '/imports/ui/components/SimpleFormFields/SearchDocField/SearchDocField';
import { IDefaultContainerProps, IDefaultListProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { ITreinamento } from '../../api/treinamentoSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { isMobile } from '/imports/libs/deviceVerify';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';
import { userInfo } from 'os';
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
		treinamentos,
		navigate,
		remove,
		showDeleteDialog,
		showDialog,
		onSearch,
		total,
		loading,
		viewComplexTable,
		setViewComplexTable,
		setFilter,
		clearFilter,
		setPage,
		setPageSize,
		searchBy,
		pageProperties,
		isMobile
	} = props;

	const [text, setText] = React.useState('');
	const idTreinamento = nanoid();

	const onClick = (_event: React.SyntheticEvent, id: string) => {
		navigate('/treinamento/view/' + id);
	};

	const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
		setPage(newPage + 1);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(1);
	};


	const change = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
		onSearch(e.target.value);
	};


	const keyPress = (_e: React.SyntheticEvent) => {
		// if (e.key === 'Enter') {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
		// }
	};

	const click = (_e: any) => {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
	};

	const callRemove = (doc: ITreinamento) => {
		if (props.user._id == doc.createdby) {
			const title = 'Remover exemplo';
			const message = `Deseja remover o exemplo "${doc.title}"?`;
			showDeleteDialog && showDeleteDialog(title, message, doc, remove);
		}
	};

	console.log(treinamentos)
	// @ts-ignore
	// @ts-ignore
	return (
		<PageLayout title={'Lista de Exemplos'} actions={[]}>
			{(!viewComplexTable || isMobile) && (
				<>
					<TextField
						name={'pesquisar'}
						label={'Pesquisar'}
						value={text}
						onChange={change}
						placeholder="Digite aqui o que deseja pesquisa..."
						action={{ icon: 'search', onClick: click }}
						sx={{ mt: 2, mb: 2 }}/>

					<SimpleTable
						schema={_.pick(
							{
								...treinamentoApi.schema,
								nomeUsuario: { type: String, label: 'Criado por' }
							},
							['image', 'title', 'description', 'pessoal', 'check', 'nomeUsuario']
						)}

						data={treinamentos}
						onClick={onClick}
						actions={[{ icon: <EditIcon />, id: 'delete', onClick: onClick },{ icon: <Delete />, id: 'delete', onClick: callRemove }]}
					/>
				</>
			)}

			{!isMobile && viewComplexTable && (
				<ComplexTable
					data={treinamentos}
					schema={_.pick(
						{
							...treinamentoApi.schema,
							nomeUsuario: { type: String, label: 'Criado por' }
						},
						['image', 'title', 'description', 'nomeUsuario']
					)}
					onRowClick={(row) => navigate('/treinamento/view/' + row.id)}
					searchPlaceholder={'Pesquisar exemplo'}
					onDelete={callRemove}
					onEdit={(row) => navigate('/treinamento/edit/' + row._id)}
					toolbar={{
						selectColumns: true,
						exportTable: { csv: true, print: true },
						searchFilter: true
					}}
					onFilterChange={onSearch}
					loading={loading}
				/>
			)}

			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center'
				}}>
				<TablePagination
					style={{ width: 'fit-content', overflow: 'unset' }}
					rowsPerPageOptions={[5, 10, 25, 50, 100]}
					labelRowsPerPage={''}
					component="div"
					count={total || 0}
					rowsPerPage={pageProperties.pageSize}
					page={pageProperties.currentPage - 1}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
					SelectProps={{
						inputProps: { 'aria-label': 'rows per page' }
					}}
				/>
			</div>

			<RenderComPermissao recursos={[Recurso.EXAMPLE_CREATE]}>
				<div
					style={{
						position: 'fixed',
						bottom: isMobile ? 80 : 30,
						right: 30
					}}>
					<Fab id={'add'} onClick={() => navigate(`/treinamento/create/${idTreinamento}`)} color={'primary'}>
						<Add />
					</Fab>
				</div>
			</RenderComPermissao>
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
	['title', 'description'] // list of fields
);

let onSearchTreinamentoTyping: NodeJS.Timeout;

const viewComplexTable = new ReactiveVar(false);

export const TreinamentoListContainer = withTracker((props: IDefaultContainerProps) => {
	const { showNotification } = props;

	//Reactive Search/Filter
	const config = subscribeConfig.get();
	const sort = {
		[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1
	};
	treinamentoSearch.setActualConfig(config);

	//Subscribe parameters
	const filter = { ...config.filter };
	// const filter = filtroPag;
	const limit = config.pageProperties.pageSize;
	const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

	//Collection Subscribe
	const subHandle = treinamentoApi.subscribe('treinamentoList', filter, {
		sort, limit, skip
	});
	const treinamentos = subHandle?.ready() ? treinamentoApi.find(filter, { sort }).fetch() : [];
	return {
		treinamentos,
		loading: !!subHandle && !subHandle.ready(),
		remove: (doc: ITreinamento) => {
			treinamentoApi.removeComCriador(doc, (e: IMeteorError) => {
				if (!e) {
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi removido com sucesso!`
						});
				} else {
					console.log('Error:', e);
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Operação não realizada!',
							description: `Erro ao realizar a operação: ${e.reason}`
						});
				}
			});
		},
		viewComplexTable: viewComplexTable.get(),
		setViewComplexTable: (enableComplexTable: boolean) => viewComplexTable.set(enableComplexTable),
		searchBy: config.searchBy,
		onSearch: (...params: any) => {
			onSearchTreinamentoTyping && clearTimeout(onSearchTreinamentoTyping);
			onSearchTreinamentoTyping = setTimeout(() => {
				config.pageProperties.currentPage = 1;
				subscribeConfig.set(config);
				treinamentoSearch.onSearch(...params);
			}, 1000);
		},
		total: subHandle ? subHandle.total : treinamentos.length,
		pageProperties: config.pageProperties,
		filter,
		sort,
		setPage: (page = 1) => {
			config.pageProperties.currentPage = page;
			subscribeConfig.set(config);
		},
		setFilter: (newFilter = {}) => {
			config.filter = { ...filter, ...newFilter };
			Object.keys(config.filter).forEach((key) => {
				if (config.filter[key] === null || config.filter[key] === undefined) {
					delete config.filter[key];
				}
			});
			subscribeConfig.set(config);
		},
		clearFilter: () => {
			config.filter = {};
			subscribeConfig.set(config);
		},
		setSort: (sort = { field: 'createdat', sortAscending: true }) => {
			config.sortProperties = sort;
			subscribeConfig.set(config);
		},
		setPageSize: (size = 25) => {
			config.pageProperties.pageSize = size;
			subscribeConfig.set(config);
		}
	};
})(showLoading(TreinamentoList));
