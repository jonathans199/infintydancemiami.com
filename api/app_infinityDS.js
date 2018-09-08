'use strict';

const SEVER_PORT = 8086
const DELIVERY_EMAIL = 'jonathan@asoftio.com'

const express   = require('express')
var bodyParser  = require('body-parser')
var cors = require('cors')
var history = require('connect-history-api-fallback');
const app     = express()
let api_key   = 'key-42b17e5481a2ad150c8d44defc8f08ff'
let domain    = 'mg.asoftio.com'
let mailgun   = require('mailgun-js')({apiKey: api_key, domain: domain})

app.use(history())
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(cors())
app.use('/', express.static('./../html'))
// GET method route

app.post('/api/contact', (req, res) => {
  let name      = req.body.name
  let lastName  = req.body.lastName
  let email   = req.body.email
  let phone   = req.body.phone
  let message = req.body.message
  var data      = {
    from: 'no-reply@infinitydancemiami.com',
    to:   DELIVERY_EMAIL,
    subject: 'Contact from your - infinitydancemiami.com',
    html: ('<h2>Contact form InfinityDanceMiami.com</h2><br> Email: ' + email + '<br> Name: ' + name + ' ' + lastName + '<br> Phone: ' + phone + '<br> Message: ' + message)
  }

  if(name && email && phone) {
    let response = mailgun.messages().send(data, function (error, body) { return body })
    res.send({ m: 'Contact successfully sent' })
  } else {
    res.status(500).send({ m: 'Some error ocurred' })
  }
})

app.post('/api/news_letters', (req, res) => {
  let email   = req.body.email
  var data    = {
    from: 'no-reply@infinitydancemiami.com',
    to:   DELIVERY_EMAIL,
    subject: 'News Letter Subscriptor - infinitydancemiami.com',
    html: ('<h2>A new user registered into your newsletter list</h2><br> Email: ' + email + '<br>')
  }

  if(email) {
    let response = mailgun.messages().send(data, function (error, body) { return body })
    res.send({ m: 'Subscribed!' })
  } else {
    res.status(500).send({ m: 'Some error ocurred' })
  }
})

app.listen(SEVER_PORT, () => console.log('Listening on port:' + SEVER_PORT))
