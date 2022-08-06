import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://kamal:kamal@cluster0.gingob6.mongodb.net/makanan-sistem-pakar?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// tes koneksi
const db = mongoose.connection;
db.on('error', (error) => console.info(error));
db.once('open', () => console.info('Database Connected...'));
