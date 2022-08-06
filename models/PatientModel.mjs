import mongoose from 'mongoose'

const { model, Schema } = mongoose


const dataCF = Schema({
    idGejala: {
        type: String,
        require: true
    },
    gejala: {
        type: String,
        require: true
    },
    CFUser: {
        type: Number,
        require: true
    },
    ket: {
        type: String,
        require: true
    }
})

const konsultasi = Schema({
    
    namaPenyakit: {
        type: String,
        require: true
    },
    hasilCF: {
        type: Number,
        require: true
    },
    dataCF: [dataCF],
})

const Patients = Schema({
    
    idUser: {
        type: String,
        require: true
    },
    konsultasi: [konsultasi]
}, {
    timestamps: true
})

export default model('Patient', Patients)