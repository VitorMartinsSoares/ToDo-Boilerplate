
import React, { useState } from 'react';
import { DayNightToggle } from './components/DayNightToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Modules from '../../modules';
import { isMobile } from '/imports/libs/deviceVerify';
import { appNavBarStyle } from './AppNavBarStyle';
import AppBar from '@mui/material/AppBar';
import { fixedMenuLayoutStyle } from './FixedMenuLayoutStyle';
import Toolbar from '@mui/material/Toolbar';
import * as appStyle from '/imports/materialui/styles';
import { IAppMenu } from '/imports/modules/modulesTypings';
import { FormControlLabel } from '@mui/material';
import Switch from '@mui/material/Switch';
import { ILayoutProps } from '/imports/typings/BoilerplateDefaultTypings';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { appTopMenuStyle } from './components/AppTopMenuStyle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import MenuItem from '@mui/material/MenuItem';
import { Box, Button, Container, Menu } from '@mui/material';

const HomeIconButton = ({ navigate }: any) => {
	return (
		<Box onClick={() => navigate('/')} sx={fixedMenuLayoutStyle.containerHomeIconButton}>
			<img style={fixedMenuLayoutStyle.homeIconButton} src="/images/wireframe/logo.png" />
		</Box>
	);
};

interface IAppNavBar extends ILayoutProps { }

export const AppNavBar = (props: IAppNavBar) => {
	const { user, showDrawer, showWindow, theme, themeOptions } = props;

	const navigate = useNavigate();
	const location = useLocation();
	const [anchorEl, setAnchorEl] = useState<Object | null>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};
	const openPage = (url: string) => () => {
		handleClose();
		navigate(url);
	};
	const viewProfile = () => {
		handleClose();
		showDrawer && showDrawer({ title: 'Usuário', url: `/userprofile/view/${user._id}` });
	};
	const viewProfileMobile = () => {
		handleClose();
		showWindow && showWindow({ title: 'Usuário', url: `/userprofile/view/${user._id}` });
	};
	const handleMenu = (event: React.SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const pathIndex = (Modules.getAppMenuItemList() || [])
		.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
		.findIndex(
			(menuData) =>
				(menuData?.path === '/' && location.pathname === '/') ||
				(menuData?.path !== '/' && location && location.pathname.indexOf(menuData?.path as string) === 0)
		);

	console.log(pathIndex);
	if (isMobile) {
		return (
			<Box
				sx={{
					minHeight: 55,
					width: '100%',
					backgroundColor: theme.palette.primary.main
				}}>
				<Box sx={{ width: '100%' }} display='flex' alignItems="center" justifyContent="space-between">
					{(Modules.getAppMenuItemList() || [])
						.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
						.map((menuData, menuIndex) => (
							<Button key={menuData?.path} onClick={() => navigate(menuData?.path as string)}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: isMobile ? 'column' : 'row',
										alignItems: 'center',
										justifyContent: 'center',

									}}>
									{menuData?.icon ? menuData?.icon : null}
								</Box>
							</Button>
						))}
					
					<FormControlLabel sx={{alignItems: 'end',
										justifyContent: 'end',}}
						control={
							<Switch
								color={'secondary'}
								value={themeOptions?.isDarkThemeMode}
								onChange={(evt) => themeOptions?.setDarkThemeMode(evt.target.checked)}
							/>
						}
						label="DarkMode"
					/>
				</Box>
				<IconButton onClick={viewProfileMobile} style={{ position: 'absolute', right: 10, bottom: 13 }}>
					<AccountCircle style={appNavBarStyle.accountCircle} />
				</IconButton>
			</Box>
		);
	}

	return (
		<AppBar position="static" enableColorOnDark>
			<Container sx={fixedMenuLayoutStyle.containerFixedMenu}>

				<DayNightToggle
					isDarkMode={themeOptions?.isDarkThemeMode as boolean}
					setDarkMode={(evt) => {
						themeOptions?.setDarkThemeMode(evt.target.checked);
					}}
				/>
				<Toolbar sx={fixedMenuLayoutStyle.toolbarFixedMenu}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center'
						}}>
						<Button variant={pathIndex !== -1 ? 'outlined' : 'contained'} sx={{ color: pathIndex !== -1 ? appStyle.secondaryColor : '#FFF'}} onClick={() => navigate('/')}>Home</Button>
						{(Modules.getAppMenuItemList() || [])
							.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
							.map((menuData, ind) => (
								<Button
									variant={pathIndex !== ind ? 'outlined' : 'contained'}
									sx={{
										...appNavBarStyle.buttonMenuItem,
										color: pathIndex !== ind ? appStyle.secondaryColor : '#FFF'
									}}
									key={menuData?.path}
									onClick={() => navigate(menuData?.path as string)}>
									{menuData?.name}
								</Button>
							))}
					</Box>
				</Toolbar>
				<Button
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={handleMenu}
					color="inherit"
					id="Perfil"
					sx={appTopMenuStyle.containerAccountCircle}>
					<>
						<AccountCircle id="Perfil" name="Perfil" style={appTopMenuStyle.accountCircle} />
						<ArrowDropDownIcon
							style={{
								color: theme.palette.primary.main,
								width: 17
							}}
						/>
					</>
				</Button>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl as Element}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right'
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={open}
					onClose={handleClose}>
					{!user || !user._id
						? [
							<MenuItem key={'signin'} onClick={openPage('/signin')}>
								Entrar
							</MenuItem>
						]
						: [
							<MenuItem key={'userprofile'} onClick={viewProfile}>
								{user.username || 'Editar'}
							</MenuItem>,
							<MenuItem key={'signout'} 
							onClick={openPage('/signout')}>
								<ExitToAppIcon fontSize="small" /> Sair
							</MenuItem>
						]}
				</Menu>
			</Container>
		</AppBar>
	);
};
