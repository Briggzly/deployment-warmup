const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: '0a8627f809f741be9667e63bf04ec900',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())
app.use('/style', express.static('./index.css'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
    rollbar.info("HTML file served successfully!")
})

app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.css'))
    rollbar.info('CSS added successfully')
})

app.get('/', (req, res) => {
    try {
        helloWorld()
    } catch (error) {
        rollbar.error(error)
    }
})

const port = process.env.PORT || 4005

app.use(rollbar.errorHandler())

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
