import express from 'express'
import { verifyTokenAdmin } from '../middleware/VerifyToken.mjs'
import { postValidasiMakanan, updateValidasiMakanan } from '../middleware/Validasi.mjs'
import { addPatient, addPatients, deletPatient, getPatient, getPatientIdUser, testing } from '../controllers/PatientController.mjs'

const router = express.Router()

router.get('/patient', getPatient)
router.get('/patient/:id', getPatientIdUser)
router.post('/patients', addPatients)
router.post('/patient', addPatient)
router.post('/patient/testing', testing)
router.delete('/patient/:id', deletPatient)

export default router