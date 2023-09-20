// region Imports
import { Recurso } from '../config/Recursos';
import { treinamentoSch, ITreinamento } from './treinamentoSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { Meteor } from 'meteor/meteor';
import { userInfo } from 'os';
import { getUser, userprofileData } from '/imports/libs/getUser';
// endregion

class TreinamentoServerApi extends ProductServerBase<ITreinamento> {
    constructor() {
        super('treinamento', treinamentoSch, {
            resources: Recurso,
        });

        const self = this;

        this.addTransformedPublication(
            'treinamentoList',
            (filter = {}, options = {}) => {
                filter = {
                    $or: [
                        { pessoal: false },
                        { createdby: getUser()._id }
                    ],
                    ...filter,
                }
                return this.defaultListCollectionPublication(filter, {
                ...options,
                projection: { image: 1, title: 1, description: 1, pessoal: 1, createdby: 1, check: 1},
            });
    },
            (doc: ITreinamento & { nomeUsuario: string }) => {
    const userProfileDoc = userprofileServerApi
        .getCollectionInstance()
        .findOne({ _id: doc.createdby });
    return { ...doc, nomeUsuario: userProfileDoc?.username };
}
        );

this.addPublication('treinamentoDetail', (filter = {}) => {

    return this.defaultDetailCollectionPublication(filter, {});
});

this.addRestEndpoint(
    'view',
    (params, options) => {
        console.log('Params', params);
        console.log('options.headers', options.headers);
        return { status: 'ok' };
    },
    ['post']
);

this.addRestEndpoint(
    'view/:treinamentoId',
    (params, options) => {
        console.log('Rest', params);
        if (params.treinamentoId) {
            return self
                .defaultCollectionPublication({
                    _id: params.treinamentoId,
                }, {})
                .fetch();
        } else {
            return { ...params };
        }
    },
    ['get']
);

this.addTransformedPublication('treinamentoListInicial', (filter = {}, sort = {}) => {
    const newFilter = { ...filter };
    const newOptions = {
        ...sort,
        skip: 0,
        limit: 5,
        projection: {  image: 1, title: 1, description: 1, pessoal: 1, createdby: 1, check: 1 },
    }
    return this.defaultCollectionPublication(newFilter, newOptions);
},
    (doc: ITreinamento & { nomeUsuario: string }) => {
        const userProfileDoc = userprofileServerApi
            .getCollectionInstance()
            .findOne({ _id: doc.createdby });
        return { ...doc, nomeUsuario: userProfileDoc?.username };
    }
);

this.registerMethod('saveComStatus', this.salvarComStatus);
this.registerMethod('editComCriador', this.editarComCriador);
this.registerMethod('removeComCriador', this.excluirComCriador);
    }

salvarComStatus = (doc: any, context: any) => {
    if (!doc.pessoal) {
        doc = {
            ...doc,
            pessoal: false,
        }
    }
    const newDoc = {
        check: 'concluida',
        ...doc
    }
    this.serverInsert(newDoc, context);
}

editarComCriador = (doc: any, context: any) => {
    const { user } = context;
    if (user._id == doc.createdby) {
        this.serverUpdate(doc, context);
    } else {
        throw new Meteor.Error(403, "Acesso exclusivo ao criador da Tarefa!");
    }
}
excluirComCriador = (doc: any, context: any) => {
    const { user } = context;
    if (user._id == doc.createdby) {
        this.serverRemove(doc, context);
    } else {
        throw new Meteor.Error(403, "Acesso exclusivo ao criador da Tarefa!");
    }
}
}


export const treinamentoServerApi = new TreinamentoServerApi();
