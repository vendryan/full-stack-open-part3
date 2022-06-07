const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(success => {
    console.log('connected to MongoDB')
  })
  .catch(error =>{
    console.log('error when connecting: ', error)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)