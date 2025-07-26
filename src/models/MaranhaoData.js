import mongoose from 'mongoose';


const maranhaoSchema = new mongoose.Schema(
    {

    _id: {
        type: String,
        required: true,
        default: 'MARANHAO_MUNICIPIOS_LIST',
    },


    municipios: {
        type: [String],
        required: true,
    },


    itemCount: {
        type: Number,
        required: true,
    },
    
    source: {
        type: String,
        required: true,
        default: 'IBGE_API'
    },


    lastUpdated: {
        type: Date,
        required: true,
    },
},
    {
    
        timestamps: false,

        collection: 'reference_lists',
    }
);

const MaranhaoData = mongoose.model('MaranhaoData', maranhaoSchema);

export default MaranhaoData;