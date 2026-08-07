// server/models/Element.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- What: Define the schema for our 'Element' collection ---
// --- Why:  This enforces a consistent structure for every element document in the database.
const elementSchema = new Schema({
  number: { type: Number, required: true, unique: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  atomicMass: { type: String, required: true },
  category: { type: String, required: true },
  electronConfig: { type: String, required: true },
  state: { type: String, required: true },
  group: { type: Number, required: true },
  period: { type: Number, required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
    electronegativity: { type: mongoose.Schema.Types.Mixed, required: false },
  ionizationEnergy: { type: mongoose.Schema.Types.Mixed, required: false },
  electronAffinity: { type: mongoose.Schema.Types.Mixed, required: false },
  oxidationStates: { type: String, required: false },
  atomicRadius: { type: mongoose.Schema.Types.Mixed, required: false },
  density: { type: mongoose.Schema.Types.Mixed, required: false },
  meltingPoint: { type: mongoose.Schema.Types.Mixed, required: false },
  boilingPoint: { type: mongoose.Schema.Types.Mixed, required: false },
  
  // What: An object to hold boolean flags for approximate values.
  // Why: This is a clean way to track which properties are estimates.
  isApproximate: { type: Object, required: false }
});


// --- What: Create the model from the schema ---
// --- Why:  This gives us our 'Element' object that we can use to query the database.
//           Mongoose will automatically create a collection named 'elements' (pluralized, lowercase).
const Element = mongoose.model('Element', elementSchema);

module.exports = Element;