// region Imports
import { ProductBase } from '../../../api/productBase';
import { treinamentoSch, ITreinamento } from './treinamentoSch';

class TreinamentoApi extends ProductBase<ITreinamento> {
    constructor() {
        super('treinamento', treinamentoSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });

    }
    saveComStatus = (doc:any,callback:any)=>{
        this.callMethod('saveComStatus',doc,callback);
    }
    editComUsuario = (doc:any,context:any)=>{
        this.callMethod('editComCriador',doc,context);
    }
    removeComCriador = (doc:any,context:any)=>{
        this.callMethod('removeComCriador',doc,context);
    }
}

export const treinamentoApi = new TreinamentoApi();
