const express = require('express');
const connectDB = require('./config/db');

const app = express();


connectDB();


app.use(express.json({ extended: false }));


app.get('/', (req, res) => res.json({
    message: 'test'
}));

app.use('/api/testroutes', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));