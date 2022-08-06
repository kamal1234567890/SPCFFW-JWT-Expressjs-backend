import { body, check } from 'express-validator'
import Users from '../models/UsersModel.mjs'
import Makanan from '../models/MakananModel.mjs'
import Penyakit from '../models/DiseaseModel.mjs'

export const postValidasiUsers = [
    check('fullName')
        .not().isEmpty().withMessage('Can not be empty'),
    body('email')
        .isEmail().withMessage('Email tidak valid')
        .custom(async (value) => {
            const duplicate = await Users.findOne({ email: value });
            if (duplicate) {
                throw new Error('Email sudah digunakan!');
            }
            return true;
        }),
    check('dateBirth')
        .isDate()
        .withMessage('Date Birth is Invalid'),
    body('password')
        .not().isEmpty().withMessage('Password Can not be empty')
        .custom((value, { req }) => {
            if (req.body.confPassword != value) {
                throw new Error('Password dan Confirm Password Harus Sama!')
            }
            return true
        })
]

export const postValidasiLogin = [
    body('email')
        .not().isEmpty().withMessage('Email can not be empty')
        .isEmail().withMessage('Email tidak valid')
        .custom(async (value) => {
            const duplicate = await Users.findOne({ email: value });
            if (!duplicate) {
                throw new Error('Email is not registered!');
            }
            return true;
        }),
    check('password').not().isEmpty().withMessage('Password can not be empty!'),
]

// validasi makanan
export const postValidasiMakanan = [
    body('nama')
        .not().isEmpty().withMessage('can not be empty')
        .custom(async (value, { req }) => {
            const penyakit = req.body.penyakit.toLowerCase()
            const duplicate = await Makanan.find({ nama: value.toLowerCase(), penyakit: penyakit })
            if (duplicate.length > 0) {
                throw new Error('Nama makanan sudah ada!');
            }
            return true;
        }),
    body('penyakit')
        .custom(async (value) => {
            const duplicate = await Penyakit.findOne({ namaPenyakit: value.toLowerCase() });
            if (!duplicate) {
                throw new Error('penyakit tidak ditemukan!');
            }
            return true;
        }),
    body('status')
        .custom(async (value) => {
            if (value.toLowerCase() == 'larangan' || value.toLowerCase() == 'rekomendasi') {
                return true;
            }
            throw new Error('Invalid status!');
        }),
]

export const updateValidasiMakanan = [
    body('nama')
        .not().isEmpty().withMessage('nama can not be empty')
        .custom(async (value, { req }) => {
            const penyakit = req.body.penyakit.toLowerCase()
            const duplicate = await Makanan.findOne({ nama: value.toLowerCase(), penyakit: penyakit })
            const makanan = await Makanan.findById(req.params.id)
            if (!makanan) {
                throw new Error('makanan not found');
            }
            if (value.toLowerCase() !== makanan.nama && duplicate) {
                throw new Error('Nama makanan sudah ada!');
            }
            if (req.body.penyakit != makanan.penyakit && duplicate) {
                throw new Error('Nama makanan sudah ada!');
            }
            return true;
        }),
    body('penyakit')
        .custom(async (value) => {
            const duplicate = await Penyakit.findOne({ namaPenyakit: value.toLowerCase() });
            if (!duplicate) {
                throw new Error('penyakit tidak ditemukan!');
            }
            return true;
        }),
    body('status')
        .custom(async (value) => {
            if (value == 'larangan' || value == 'rekomendasi') {
                return true;
            }
            throw new Error('Invalid status!');
        }),
]

// validasi penyakit

export const postValidasiPenyakit = [
    body('namaPenyakit').not().isEmpty().withMessage('Nama penyakit is required')
        .custom(async (value) => {
            const duplicate = await Penyakit.findOne({ namaPenyakit: value.toLowerCase() });
            if (duplicate) {
                throw new Error('nama penyakit sudah ada!');
            }
            return true;
        }),
    check('deskripsi').not().isEmpty().withMessage('Deskripsi is required'),
]

export const updateValidasiPenyakit = [
    body('namaPenyakit').not().isEmpty().withMessage('Nama penyakit is required')
        .custom(async (value, { req }) => {
            const duplicate = await Penyakit.findOne({ namaPenyakit: value.toLowerCase() })
            const penyakit = await Penyakit.findById(req.params.id)
            if (value.toLowerCase() !== penyakit.namaPenyakit && duplicate) {
                throw new Error('nama penyakit sudah ada!');
            }
            return true;
        }),
    check('deskripsi').not().isEmpty().withMessage('Deskripsi is required'),
]

export const postValidasiGejala = [
    body('gejala')
        .not().isEmpty().withMessage('gejala is required')
        .custom(async (value, { req }) => {
            const penyakit = await Penyakit.findById(req.params.id)
            const duplicate = penyakit.gejala.filter((gejala) => gejala.gejala == value.toLowerCase())
            if (duplicate.length > 0) {
                throw new Error('gejala sudah ada!');
            }
            return true;
        }),
    check('role')
        .not().isEmpty().withMessage('role is required')
        .isFloat({ min: -1, max: 1 }).withMessage('role tidak valid'),
]

export const updateValidasiGejala = [
    body('gejala')
        .not().isEmpty().withMessage('gejala is required')
        .custom(async (value, { req }) => {
            const newValue = value.toLowerCase()
            const penyakit = await Penyakit.findOne({ "gejala._id": req.params.id })
            if (penyakit) {
                const duplicate = penyakit.gejala.filter((gejala) => gejala.gejala == newValue)
                const gejala = penyakit.gejala.filter((gejala) => gejala._id == req.params.id)
                if (newValue !== gejala[0].gejala && duplicate.length > 0) {
                    throw new Error('gejala sudah ada!');
                }
            }
            return true;
        }),
    check('role')
        .not().isEmpty().withMessage('Deskripsi is required')
        .isFloat({ min: -1, max: 1 }).withMessage('role tidak valid'),
]