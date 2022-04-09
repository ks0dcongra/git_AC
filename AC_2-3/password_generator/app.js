//require related modules used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const generatePassword = require('./generate_password')
const app = express()
const port = 3000


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(expressbodyParser.urlencoded({ extended: true })) 
//改寫成 express，也可以直接取得，但要刪掉上面的exphbs

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const options = req.body
  // console.log('random password is: ', generatePassword(req.body))
  const password = generatePassword(options)
  res.render('index',{password: password, options: options})
})

app.listen(port, () => {
  console.log(`The Express server is running on http://localhost:${port}`)
})