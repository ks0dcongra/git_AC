// Include express from node_modules
const express = require('express')
const app = express()
// Define server related variables
const port = 3000

// Handle request and response here
app.get('/', (req, res) => {
  res.send(`This is my first Express Web App!`)
})

app.get('/food', (req, res) => {
  res.send('My favorite food is steak.')
})

app.get('/popular/languages/:language', (req, res) => {
  // console.log('req', req)
  // console.log('request params language is: ', req.params.language)
  res.send(`<h1>${req.params.language} is a popular language</h1>`)
})

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})