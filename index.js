const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5001

const app = express();

app.use(express.json());
app.use('/auth', authRouter)

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://user:user@cluster0.ot8fv1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  } catch (e) {
    console.error(e);
  }
}

start()