const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  contractType: { 
    type: String, 
    required: true, 
    enum: ['Umowa o pracę', 'Umowa zlecenie', 'Umowa o dzieło', 'B2B'] 
  },
  salary: { type: Number },
  requiresPolish: { type: Boolean, default: false },
  requiresEnglish: { type: Boolean, default: false },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  postedDate: { type: Date, default: Date.now },
  
  // Subdocumento para la Empresa
  company: {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    website: { type: String }
  },

  // Subdocumento opcional para la Agencia
  agency: {
    name: { type: String },
    krazNumber: { type: String },
    website: { type: String },
    rating: { type: Number }
  }
}, {
  // Transforma el _id de Mongo a "id" para alinearlo con Angular
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Offer', offerSchema);