require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/persons')
const app = express()

morgan.token('reqbody', (request, response) => JSON.stringify(request.body))

app.use(express.static('build'))
// JSON parser
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

// DON'T FORGET TO CONVERT ID TO INTEGER
// I FORGET EVERYTIME

app.get('/info', (request, response) => {
  const time = new Date()
  response.send(`<div>Phone book has info for ${persons.length} people</div>` + 
                `<div>${time}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person.findById(id).then(person => {
    response.json(person)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }) 
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" })
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})