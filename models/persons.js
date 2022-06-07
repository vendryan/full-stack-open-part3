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
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return (v.length >= 8) && (/\d{2,3}-\d+/.test(v) || /^\d+$/.test(v))  
      },
      message: (props) => {
        if (props.value.length < 8) {
          return `The number length must be at least 8`
        }
        else {
          return (`if formed two parts seperated by - then first part have to ` + 
                  `consist of 2 or 3 number and the second also have ` + 
                  `to consist of number`)
        }
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)