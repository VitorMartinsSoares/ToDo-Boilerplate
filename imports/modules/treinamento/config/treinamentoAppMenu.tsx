import React from 'react';
import Class from '@mui/icons-material/Class';
import { IAppMenu } from '/imports/modules/modulesTypings';

export const treinamentoMenuItemList: (IAppMenu | null)[] = [
    {
        path: '/treinamento',
        name: 'Lista de Tarefas',
        icon: <Class />,
    },
];
