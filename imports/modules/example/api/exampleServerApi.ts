// region Imports
import { Recurso } from '../config/Recursos';
import { exampleSch, IExample } from './exampleSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { check } from 'meteor/check';
// endregion

class ExampleServerApi extends ProductServerBase<IExample> {
	constructor() {
		super('example', exampleSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});		// this.getCollectionInstance().update(id,{
		// 	$set:{
		// 		...newDoc
		// 	}
		// });

		const self = this;

		this.addTransformedPublication(
			'exampleList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { image: 1, title: 1, description: 1, createdby: 1 }
				});
			},
			(doc: IExample & { nomeUsuario: string }) => {
				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc, nomeUsuario: userProfileDoc?.username };
			}
		);

		this.addPublication('exampleDetail', (filter = {}) => {
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
			'view/:exampleId',
			(params, options) => {
				console.log('Rest', params);
				if (params.exampleId) {
					return self
						.defaultCollectionPublication(
							{
								_id: params.exampleId
							},
							{}
						)
						.fetch();
				} else {
					return { ...params };
				}
			},
			['get']
		);

		this.registerMethod('mudarTituloDescricao', this.serverMudarTituloEDescricao);

	}

	serverMudarTituloEDescricao = (_id: string, context: any) => {
		check(_id, String);
		const {user} = context;
		if(user.roles.indexOf('Adminis     	trador')===-1){
			throw new Meteor.Error(403,"Acesso Negado!!!");
		}
		const newDoc = {
			title: "Alterei o titulo",
			description: "Nova Descricao - 123"
		}
		return this.serverUpdate({ _id: _id, ...newDoc }, context);
	}
}

export const exampleServerApi = new ExampleServerApi();