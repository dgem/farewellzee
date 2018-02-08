const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/complete', (req, res) => {
  console.log(req.params)
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
