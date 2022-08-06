import Makanan from '../models/MakananModel.mjs'
import { validationResult } from 'express-validator'

export const getMakanan = async (req, res) => {
    try {
        const {
            page = 0,
            limit = 20,
            search = '',
            status = ''
        } = req.query

        const re = new RegExp(search, 'i')
        const reStatus = new RegExp(status, 'i')

        const makanan = await Makanan
            .find({
                status: { $regex: reStatus },
                $or: [
                    { nama: { $regex: re } },
                    { penyakit: { $regex: re } },
                    { status: { $regex: re } }]
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .select('nama penyakit status')

        const totalRows = await Makanan
            .count({
                status: { $regex: reStatus },
                $or: [
                    { nama: { $regex: re } },
                    { penyakit: { $regex: re } },
                    { status: { $regex: re } }]
            })

        res.json({
            result: makanan,
            totalRows,
            totalPage: Math.ceil(totalRows / limit)
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMakananById = async (req, res) => {
    try {
        const makanan = await Makanan.findById(req.params.id)
        res.json(makanan)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const addMakanan = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const { nama, penyakit, status, deskripsi } = req.body
            const makanan = new Makanan({
                nama: nama.toLowerCase(),
                penyakit: penyakit.toLowerCase(),
                status: status.toLowerCase(),
                deskripsi
            })

            const response = await makanan.save()
            res.status(201).json(response)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

export const addMakanans = async (req, res) => {

        try {
            const makanan = Makanan.insertMany(
                []
            )

            res.status(201).json(makanan)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    
}

export const deletMakanan = async (req, res) => {
    try {
        const response = await Makanan.deleteOne({ _id: req.params.id })
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateMakanan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const { nama, penyakit, status, deskripsi } = req.body
            const response = await Makanan.updateOne({ _id: req.params.id }, {
                $set: {
                    nama: nama.toLowerCase(),
                    penyakit: penyakit.toLowerCase(),
                    status: status.toLowerCase(),
                    deskripsi
                }
            })
            res.status(200).json(response)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

export const postGetMakanan = async (req, res) => {

    try {
        const penyakits = req.body
        const { status = '' } = req.query

        const reStatus = new RegExp(status, 'i')
        const makanan = await Makanan
            .find({
                status: { $regex: reStatus },
                $or: penyakits
            })
            .select('nama penyakit status')

        makanan.forEach((mkn1, index1) => {
            makanan.forEach((mkn2, index2) => {
                if (mkn1.nama === mkn2.nama && index1 !== index2) {
                    makanan.splice(index2, 1)
                }
            })
        })


        res.json({ makanan })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}

