import mongoose from 'mongoose'

const { model, Schema } = mongoose

// gejala
const Gejala = Schema({
    gejala: String,
    role: Number,
    ket: String
})

const Disease = ({
    namaPenyakit: {
        type: String,
        require: true
    },
    deskripsi: {
        type: String,
        require: true
    },
    gejala: [Gejala]
})

export default model('Disease', Disease)