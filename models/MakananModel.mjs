import mongoose from 'mongoose'

const { model, Schema } = mongoose

const Makanan = Schema({
    nama: {
        type: String,
        require: true
    },
    penyakit: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    deskripsi: {
        type: String,
        default: 'deskripsi'
    }
}, {
    timestamps: true
})

export default model('Makanan', Makanan)