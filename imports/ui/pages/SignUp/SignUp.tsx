// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import { Link, NavigateFunction } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '../../components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import { userprofileApi } from '../../../userprofile/api/UserProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';
import React, { useContext, useEffect, useState } from 'react';
import { signUpStyle } from './SignUpStyle';
import { Box } from '@mui/system';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';
import { FixedMenuLayoutContext } from '../../layouts/FixedMenuLayout';

interface ISignUp {
	showNotification: (options?: Object) => void;
	navigate: NavigateFunction;
	user: IUserProfile;
}

export const SignUp = (props: ISignUp) => {
	const { handleExibirAppBar, handleOcultarAppBar } = useContext(FixedMenuLayoutContext);
	const { showNotification, navigate, user } = props;
	const handleSubmit = (doc: { email: string; password: string }) => {
		const { email, password } = doc;

		userprofileApi.insertNewUser({ email, username: email, password }, (err, r) => {
			if (err) {
				console.log('Login err', err);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Problema na criação do usuário!',
						description: 'Erro ao fazer registro em nossa base de dados!'
					});
			} else {
				showNotification &&
					showNotification({
						type: 'sucess',
						title: 'Cadastrado com sucesso!',
						description: 'Registro de usuário realizado em nossa base de dados!'
					});
			}
		});
	};

	useEffect(() => {
		handleOcultarAppBar();
		return () => handleExibirAppBar();
	}, []);

	React.useEffect(() => {
		if (!!user && !!user._id) navigate('/');
	}, [user]);

	React.useEffect(() => {
		if (location.pathname === '/signout') navigate('/signin');
	}, [location.pathname]);

	return (
		<Container sx={{ width: '100%', maxWidth: 400, alignItems: 'center' }}>
			<Box display="flex" height="100vh" alignItems="center" justifyContent="center">
				<Box>
					<h1 style={signUpStyle.labelRegisterSystem}>
					<img  src="/images/wireframe/logo.png" style={signUpStyle.imageLogo} />
						Cadastro no sistema</h1>
					<h3 style={signUpStyle.labelRegisterSystem}>
						<span>Insira seu e-mail e senha para efetuar o cadastro.</span>
					</h3>
					<SimpleForm
						schema={{
							email: {
								type: String,
								label: 'Email',
								optional: false
							},
							password: {
								type: String,
								label: 'Senha',
								optional: false
							}
						}}
						onSubmit={handleSubmit}>
						<TextField id="Email" label="Email" fullWidth name="email" type="email" placeholder="Digite um email" sx={{ mb: 2 }} />
						<TextField id="Senha" label="Senha" fullWidth name="password" placeholder="Digite uma senha" type="password" sx={{ mb: 2 }} />
						<Box sx={signUpStyle.containerButtonOptions}>
							<Button color={'primary'} variant={'outlined'} id="submit">
								Cadastrar
							</Button>
						</Box>
					</SimpleForm>

					<Box display="flex" alignItems="center" justifyContent="center">
						<h5>
							Já tem uma conta? {' '}
							<Link to="/signin" color={'secondary'}>
								Login aqui
							</Link>
						</h5>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};
