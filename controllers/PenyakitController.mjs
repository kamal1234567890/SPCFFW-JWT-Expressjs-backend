import Penyakit from '../models/DiseaseModel.mjs'
import Bobot from '../models/BobotModel.mjs'
import { validationResult } from 'express-validator'

export const getPenyakit = async (req, res) => {
    try {
        const { select } = req.query
        const penyakit = await Penyakit.find().select(select)
        res.json(penyakit)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getPenyakitById = async (req, res) => {
    try {
        const penyakit = await Penyakit.findById(req.params.id)
        res.json(penyakit)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const addPenyakit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const { namaPenyakit, deskripsi } = req.body

            const penyakit = new Penyakit({
                namaPenyakit: namaPenyakit.toLowerCase(),
                deskripsi: deskripsi
            })

            res.status(201).json(await penyakit.save())

        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }

}
export const addGejala = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const { gejala, role } = req.body
            const { id } = req.params
            const penyakit = await Penyakit.findById(id)
            const bobots = await Bobot.findOne()
            const ket = bobots.admin.find(bobot => bobot.nilai == role)
            penyakit.gejala.push({
                gejala: gejala.toLowerCase(),
                role: role,
                ket: ket.ket
            })
            const response = await penyakit.save()
            res.status(201).json(response)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }

}

export const deletGejala = async (req, res) => {
    const { id } = req.params
    try {
        const penyakit = await Penyakit.findOne({ 'gejala._id': id })
        const newGejala = penyakit.gejala.filter((gejala) => gejala._id != id)
        penyakit.gejala = newGejala
        const response = await penyakit.save()
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deletPenyakit = async (req, res) => {
    try {
        const response = await Penyakit.deleteOne({ _id: req.params.id })
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}

export const updateGejala = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        const { id } = req.params
        try {
            const { gejala, role } = req.body
            const bobots = await Bobot.findOne()
            const ket = bobots.admin.find(bobot => bobot.nilai == role)
            const response = await Penyakit.updateOne({ "gejala._id": id }, {
                $set: {
                    "gejala.$.gejala": gejala.toLowerCase(),
                    "gejala.$.role": role,
                    "gejala.$.ket": ket.ket,
                }
            })
            res.status(200).json(response)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}
export const updatePenyakit = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        const { id } = req.params
        try {
            const { namaPenyakit, deskripsi } = req.body
            const response = await Penyakit.updateOne({ _id: id }, {
                $set: {
                    namaPenyakit: namaPenyakit.toLowerCase(),
                    deskripsi
                }
            })
            res.status(200).json(response)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

