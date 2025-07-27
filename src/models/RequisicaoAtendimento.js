import mongoose from 'mongoose';

const RequisicaoAtendimentoSchema = new mongoose.Schema({
  unidadeSaude: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnidadeSaude',  
    required: true,
    index: true
  },
}, {
  timestamps: true,
});

const RequisicaoAtendimento = mongoose.model('RequisicaoAtendimento', RequisicaoAtendimentoSchema);

export default RequisicaoAtendimento;
