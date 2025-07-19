import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
    unique: true,
    index: true, 
  },
  displayName: {
    text: String,
    languageCode: String,
  },
  formattedAddress: String,
  nationalPhoneNumber: String,
  municipio: {
    type: String,
    index: true, 
  },
  category: {
    type: String,
    index: true, 
  },

}, {
  timestamps: true,
});

PlaceSchema.index({ municipio: 1, category: 1 });

const Place = mongoose.model('Place', PlaceSchema);

export default Place;