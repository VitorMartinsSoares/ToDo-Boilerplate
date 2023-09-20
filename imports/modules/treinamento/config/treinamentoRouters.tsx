import React from 'react';
import TreinamentoContainer from '../ui/pages/treinamentoContainer';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const treinamentoRouterList: IRoute[] = [
    {
        path: '/treinamento/:screenState/:treinamentoId',
        component: TreinamentoContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
    {
        path: '/treinamento/:screenState',
        component: TreinamentoContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_CREATE],
    },
    {
        path: '/treinamento',
        component: TreinamentoContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
];
