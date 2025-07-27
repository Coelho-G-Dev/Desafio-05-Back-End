import mongoose from 'mongoose';


const pointSchema = new mongoose.Schema({
type: {
    type: String,
    enum: ['Point'],
    required: true
},
coordinates: {
    type: [Number],
    required: true
}
});

const UnidadeSaudeSchema = new mongoose.Schema({
placeId: {
    type: String,
    unique: true,
    sparse: true 
},
nomeUnidade: {
    type: String,
    required: true
},
enderecoCompleto: String,
municipio: {
    type: String,
    required: true,
    index: true 
},
    categoria: {
    type: String,
    required: true,
    enum: ['UPA', 'Posto de Saúde', 'Hospital', 'Clínica Especializada'], 
    index: true 
},
location: {
    type: pointSchema,
    required: true,
    index: '2dsphere' 
}
}, {
timestamps: true, 
});

const UnidadeSaude = mongoose.model('UnidadeSaude', UnidadeSaudeSchema);

export default UnidadeSaude;
