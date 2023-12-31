import { IDoc } from '/imports/typings/IDoc';

export const treinamentoSch = {
    teste: {
        type: String,
        label: 'Teste',
        defaultValue: 'Funcionou',
        optional: true
    },
    image: {
        type: String,
        label: 'Imagem',
        defaultValue: '',
        optional: true,
        isImage: true,
    },
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    pessoal: {
        type: Boolean,
        label: 'Pessoal',
        defaultValue:false ,
        optional: true
    }
    ,
    check: {
        type: String,
        label: 'Status da Tarefa:',
        defaultValue: {},
        optional: true,
        options: [
            { value: 'nc', label: 'Não Concluída' },
            { value: 'concluida', label: 'Concluída' }]
    },
    type: {
        type: String,
        label: 'Tipo',
        defaultValue: '',
        optional: true,
        options: [
            { value: 'normal', label: 'Normal' },
            { value: 'hard', label: 'Dificil' },
            { value: 'internal', label: 'Interna' },
            { value: 'extra', label: 'Extra' },
        ],
    },
    typeMulti: {
        type: [String],
        label: 'Tipo com vários valores',
        defaultValue: '',
        optional: false,
        multiple: true,
        visibilityFunction: (doc: any) => !!doc.type && doc.type === 'extra',
        options: [
            { value: 'normal', label: 'Normal' },
            { value: 'extra', label: 'Extra' },
            { value: 'minimo', label: 'Minimo' },
        ],
    },
    dateEdit: {
        type: Date,
        label: 'Data',
        defaultValue: '',
        optional: true,
    },
    files: {
        type: [Object],
        label: 'Arquivos',
        defaultValue: '',
        optional: true,
        isUpload: true,
    },
    chip: {
        type: [String],
        label: 'Chips',
        defaultValue: '',
        optional: true,
    },
    contacts: {
        type: Object,
        label: 'Contatos',
        defaultValue: '',
        optional: true,
        subSchema: {
            phone: {
                type: String,
                label: 'Telefone',
                defaultValue: '',
                optional: true,
                mask: '(##) ####-####',
            },
            cpf: {
                type: String,
                label: 'CPF',
                defaultValue: '',
                optional: true,
                mask: '###.###.###-##',
            },
        },
    },
    tasks: {
        type: [Object],
        label: 'Tarefas',
        defaultValue: '',
        optional: true,
        subSchema: {
            name: {
                type: String,
                label: 'Nome da Tarefa',
                defaultValue: '',
                optional: true,
            },
            description: {
                type: String,
                label: 'Descrição da Tarefa',
                defaultValue: '',
                optional: true,
            },
        },
    },
    audio: {
        type: String,
        label: 'Áudio',
        defaultValue: '',
        optional: true,
        isAudio: true,
    },
    address: {
        type: Object,
        label: 'Localização',
        defaultValue: '',
        isMapLocation: true,
        optional: true,
    },
    slider: {
        type: Number,
        label: 'Slider',
        defaultValue: 0,
        optional: true,
        max: 100,
        min: 0,
    },
    statusRadio: {
        type: String,
        label: 'Status da Tarefa',
        defaultValue: '',
        optional: true,
        radiosList: ['Todo', 'Doing', 'Done'],
    },
    statusToggle: {
        type: Boolean,
        label: 'Status Toogle',
        defaultValue: false,
        optional: true,
    },
};

export interface ITreinamento extends IDoc {
    image: string;
    title: string;
    description: string;
    teste: string;
    statusRadio: String;
    check: Object;
}
