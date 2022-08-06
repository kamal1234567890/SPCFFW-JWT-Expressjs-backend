import express from 'express'
import { verifyTokenAdmin, verifyToken } from '../middleware/VerifyToken.mjs'
import {
    postValidasiGejala,
    postValidasiPenyakit,
    updateValidasiGejala,
    updateValidasiPenyakit
} from '../middleware/Validasi.mjs'
import {
    getPenyakit,
    getPenyakitById,
    addPenyakit,
    addGejala,
    deletPenyakit,
    deletGejala,
    updateGejala,
    updatePenyakit,
} from '../controllers/PenyakitController.mjs'

const router = express.Router()

router.get('/penyakit', verifyToken, getPenyakit)
router.get('/penyakit/:id', getPenyakitById)
router.post('/penyakit', verifyTokenAdmin, postValidasiPenyakit, addPenyakit)
router.delete('/penyakit/:id', verifyTokenAdmin, deletPenyakit)
router.patch('/penyakit/:id', updateValidasiPenyakit, updatePenyakit)

router.post('/gejala/:id', postValidasiGejala, addGejala)
router.delete('/gejala/:id', deletGejala)
router.patch('/gejala/:id', updateValidasiGejala, updateGejala)


export default router