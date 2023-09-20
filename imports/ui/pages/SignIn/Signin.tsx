// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React, { useContext, useEffect, useState } from 'react';
import { Link, NavigateFunction, useLocation } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Container from '@mui/material/Container';
import TextField from '../../../ui/components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { signinStyle } from './SigninStyle';
import { Box } from '@mui/material';
import { FixedMenuLayoutContext } from '../../layouts/FixedMenuLayout';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';

interface ISignIn {
	showNotification: (options?: Object) => void;
	navigate: NavigateFunction;
	user: IUserProfile;
}

export const SignIn = (props: ISignIn) => {
	const [redirectToReferer, setRedirectToReferer] = useState(false);

	const location = useLocation();

	const { handleExibirAppBar, handleOcultarAppBar } = useContext(FixedMenuLayoutContext);

	const { showNotification, navigate, user } = props;

	useEffect(() => {
		handleOcultarAppBar();
		return () => handleExibirAppBar();
	}, []);

	const handleSubmit = (doc: { email: string; password: string }) => {
		const { email, password } = doc;
		Meteor.loginWithPassword(email, password, (err: any) => {
			if (err) {
				showNotification({
					type: 'warning',
					title: 'Acesso negado!',
					description:
						err.reason === 'Incorrect password'
							? 'Email ou senha inválidos'
							: err.reason === 'User not found'
								? 'Este email não está cadastrado em nossa base de dados.'
								: ''
				});
			} else {
				showNotification({
					type: 'sucess',
					title: 'Acesso autorizado!',
					description: 'Login de usuário realizado em nossa base de dados!'
				});
				setRedirectToReferer(true);
			}
		});
	};

	React.useEffect(() => {
		if (!!user && !!user._id) navigate('/');
	}, [user]);

	React.useEffect(() => {
		if (location.pathname === '/signout') navigate('/signin');
	}, [location.pathname]);

	return (
		<>
			<Container sx={{ width: '100%', maxWidth: 400, alignItems: 'center' }}>
				<Box display="flex" height="100vh" alignItems="center" justifyContent="center">
					<Box>
						<h1 style={signinStyle.labelAccessSystem}>
						<img  src="/images/wireframe/logo.png" style={signinStyle.imageLogo} />
							<span>ToDo List</span>
							</h1>
						<h2 style={signinStyle.labelAccessSystem}>
							<span>Boas Vindas a sua lista de tarefas.</span>
							<span>Insira seu e-mail e senha para efetuar o login.</span>
						</h2>
						<SimpleForm
							schema={{
								email: { type: 'String', label: 'Email', optional: false },
								password: { type: 'String', label: 'Senha', optional: false }
							}}
							onSubmit={handleSubmit}>
							<Box sx={{ mb: 2 }}>
								<TextField label="Email" fullWidth={true} name="email" type="email" placeholder="Digite seu email" sx={{ mb: 2 }} />
								<TextField
									label="Senha"
									fullWidth={true}
									name="password"
									placeholder="Digite sua senha"
									type="password"
									sx={{ mb: 2 }}
								/>
								<Box sx={signinStyle.containerButtonOptions}>
									<Button id="submit" variant={'outlined'} color={'primary'}>
										Entrar
									</Button>
								</Box>
							</Box>
							<Box display="flex" alignItems="center" justifyContent="center">
								<h5>
									Esqueceu sua senha? <Link to='/password-recovery' color={'secondary'}>Clique Aqui</Link>
								</h5>
							</Box>
							<Box display="flex" alignItems="center" justifyContent="center">
								<h5>
									É Novo Por Aqui? <Link to='/signup' color={'secondary'}>Cadastre Aqui!</Link>
								</h5>
							</Box>
						</SimpleForm>
					</Box>
				</Box>
			</Container>
		</>
	);
};
