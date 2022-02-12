const mongoose = require('mongoose')

const mokForma = new mongoose.Schema({ 
    id: String,
  name: String,
  surname: String,
  email: String,
 password: String,
 asmens_kodas: Number,
 date:{ type: Date, default: Date.now }
})

module.exports = mongoose.model('mokinys', mokForma)