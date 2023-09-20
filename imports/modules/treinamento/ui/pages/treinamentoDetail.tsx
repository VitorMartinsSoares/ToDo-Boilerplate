import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { treinamentoApi } from '../../api/treinamentoApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';
import { PageLayout } from '../../../../ui/layouts/PageLayout';
import { ITreinamento } from '../../api/treinamentoSch';
import { IDefaultContainerProps, IDefaultDetailProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { Check } from '@mui/icons-material';
import CheckBoxField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';
import { getUser } from '/imports/libs/getUser';
import ToggleButtonField from '/imports/ui/components/SimpleFormFields/ToggleButtonField/ToggleButtonField';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';

interface ITreinamentoDetail extends IDefaultDetailProps {
	treinamentoDoc: ITreinamento;
	saveEdit: (doc: ITreinamento, _callback?: any) => void;
	saveStatus: (doc: ITreinamento, _callback?: any) => void;
}

const TreinamentoDetail = (props: ITreinamentoDetail) => {
	const { isPrintView, screenState, loading, treinamentoDoc, saveEdit, saveStatus, navigate } = props;

	const theme = useTheme();

	const handleSubmit = (doc: ITreinamento) => {
		if (screenState === 'edit') {
			saveEdit(doc);
		} else {
			saveStatus(doc);
		}
	};

	return (
		<PageLayout
			key={'ExemplePageLayoutDetailKEY'}
			title={
				screenState === 'view' ? 'Visualizar exemplo' : screenState === 'edit' ? 'Editar Exemplo' : 'Criar exemplo'
			} 
			onBack={() => navigate('/treinamento')}
			>
			<SimpleForm
				key={'ExempleDetail-SimpleFormKEY'}
				mode={screenState}
				schema={treinamentoApi.getSchema()}
				doc={treinamentoDoc}
				onSubmit={handleSubmit}
				loading={loading}>
				<ImageCompactField key={'ExempleDetail-ImageCompactFieldKEY'} label={'Imagem Zoom+Slider'} name={'image'}/>

				<FormGroup key={'fieldsOne'}>
					<TextField key={'f1-tituloKEY'} placeholder="Titulo" name="title"/>
					<TextField key={'f1-descricaoKEY'} placeholder="Descrição" name="description"/>
					<ToggleField key={"TreinamentoPessoal"} name="pessoal" label="Pessoal" placeholder="Pessoal" />
					<div>
						{(screenState === 'view' || screenState === 'edit') ? (
							<SelectField key={'f2-tipoKEY'} placeholder="Selecione um tipo" name="check"/>
						) : null}
					</div>
				</FormGroup>
				<div
					key={'Buttons'}
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'left',
						paddingTop: 20,
						paddingBottom: 20
					}}>
					{!isPrintView ? (
						<FormGroup key={'fieldsOne'}>

							<Button
								key={'b1'}
								style={{ marginRight: 10 }}
								onClick={
									screenState === 'edit'
										? () => navigate(`/treinamento/view/${treinamentoDoc._id}`)
										: () => navigate(`/treinamento/list`)
								}
								color={'secondary'}
								variant="contained">
								{screenState === 'view' ? 'Voltar' : 'Cancelar'}
							</Button>
						</FormGroup>
					) : null}

					{!isPrintView && screenState === 'view' && treinamentoDoc.createdby== getUser()._id ?  (
						<Button
							key={'b2'}
							onClick={() => {
								navigate(`/treinamento/edit/${treinamentoDoc._id}`);
							}}
							color={'primary'}
							variant="contained">
							{'Editar'}
						</Button>
					) : null}
					{!isPrintView && screenState == 'edit' && treinamentoDoc.createdby== getUser()._id ? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit">
							{'Salvar'}
						</Button>
					) : null}
					{!isPrintView && screenState !== 'view' && screenState !== 'edit'? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit">
							{'Salvar'}
						</Button>
					) : null}
				</div>
			</SimpleForm>
		</PageLayout>
	);
};

interface ITreinamentoDetailContainer extends IDefaultContainerProps { }

export const TreinamentoDetailContainer = withTracker((props: ITreinamentoDetailContainer) => {
	const { screenState, id, navigate, showNotification } = props;

	const subHandle = !!id ? treinamentoApi.subscribe('treinamentoDetail', { _id: id }) : null;
	let treinamentoDoc = id && subHandle?.ready() ? treinamentoApi.findOne({ _id: id }) : {};

	return {
		screenState,
		treinamentoDoc,
		saveStatus: (doc: ITreinamento, _callback: () => void) => {
			treinamentoApi.saveComStatus(doc, (e: IMeteorError, r: string) => {
				if (!e) {
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
						});
					navigate(`/treinamento/`);
				} else {
					console.log('Error:', e);
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Operação não realizada!',
							description: `Erro ao realizar a operação: ${e.reason}`
						});
				}
			})
		},
		saveEdit: (doc: ITreinamento, _callback: () => void) => {
			treinamentoApi.editComUsuario(doc, (e: IMeteorError, r: string) => {
				if (!e) {
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
						});
					navigate(`/treinamento/`);
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
		}
	};
})(showLoading(TreinamentoDetail));
