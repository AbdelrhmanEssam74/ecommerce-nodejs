const express = require('express');
const path = require('path');
const app = express();
const route = require('./router/route')
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use('/api', route);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})