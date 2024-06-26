const mongoose = require('mongoose'); 

//estructura de bd
const careerSchema = new mongoose.Schema({
    name: { type: String,  required: true },
    code: { type: Number, required: true  },
    description: { type: String }
});


module.exports = mongoose.model('Career', careerSchema);