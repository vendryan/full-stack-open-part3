const mongoose = require('mongoose')

if (process.argv.length === 3 || process.argv.length === 5) {
  const password = process.argv[2]
  const url = `mongodb+srv://venven:${password}@cluster0.fj2z7o5.mongodb.net/phonebook?retryWrites=true&w=majority`

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 3) {
    mongoose
      .connect(url)
      .then((result) => {
        return Person.find({})
      })
      .then(result => {
        console.log('phonebook:')
        result.forEach(r => console.log(`${r.name} ${r.number}`))
        mongoose.connection.close()
      })
  }
  else {
    const name = process.argv[3]
    const number = process.argv[4]

    mongoose
      .connect(url)
      .then((result) => {
        const person = new Person({
          name: name,
          number: number
        })
        return person.save()
      })
      .then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
  }
}
else {
  console.log('Error, retrieve the database with: node mongo.js <password>')
  console.log('Or insert phonebook entry: node mongo.js <password> <name> <number>')
}