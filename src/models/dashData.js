import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: 'Dados_de_requisicoes',
    },


    categoria_selecionada: {
        type: [String],
        required: true,
    },

    municipios_selecionado: {
        type: [String],
        required: true,
    },

    bairro_selecionado: {
        type: [String],
        required: true,
    },
    
    unidade_selecionada: {
        type : [String], 
        required: true,

    },

    momento_requisicao: {   
        type: Date,
        required: true,
    },
},
    {
    
        timestamps: false,

        collection: 'reference_lists',
    }
);



const user_data = mongoose.model('user_data', userSchema);

export default user_data;



