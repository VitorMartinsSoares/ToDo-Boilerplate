// region Imports
import { ProductBase } from '../../../api/productBase';
import { exampleSch, IExample } from './exampleSch';

class ExampleApi extends ProductBase<IExample> {
    constructor() {
        super('example', exampleSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });
    }

    mudarTituloEDescricao = (id: any,callback = (e,r) =>{
        console.log(e);
    }) =>{
        console.log(this.callMethod)
        this.callMethod('mudarTituloDescricao',id,callback);
    }
}

export const exampleApi = new ExampleApi();
