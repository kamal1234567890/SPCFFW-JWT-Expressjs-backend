import Patient from '../models/PatientModel.mjs'
import Penyakit from '../models/DiseaseModel.mjs'
import Bobot from '../models/BobotModel.mjs'
import { validationResult } from 'express-validator'


export const getPatient = async (req, res) => {
    try {
        const patient = Patient.find()
        res.json(patient)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addPatients = async (req, res) => {
    try {

        const patients = []

        req.body.forEach((element, index) => {
            const { idUser, namaPenyakit, dataCF } = element
            const penyakit = await Penyakit.findOne({ namaPenyakit })
            const gejalas = penyakit.gejala
            const bobot = await Bobot.findOne()
            const bobotUser = bobot.user
            const CFHE = []

            dataCF.forEach((CF, index) => {
                const cekIdGejala = gejalas.find(gejala => gejala._id == CF.idGejala)
                if (!cekIdGejala) {
                    throw new Error('id gejala tidak ditemukan!');
                }
                gejalas.forEach((gejala) => {
                    if (CF.idGejala == gejala._id) {
                        const ket = bobotUser.find(bobot => bobot.nilai == dataCF[index].CFUser)
                        dataCF[index].ket = (ket.ket)
                        dataCF[index].gejala = (gejala.gejala)
                        // dataCF[index].CFAdmin = (gejala.role)
                        CFHE.push(parseFloat((gejala.role * dataCF[index].CFUser).toFixed(2)))
                    }
                })
            })

            const CFCombinate = []
            let old = CFHE[0]
            for (let index = 1; index < CFHE.length; index++) {
                if (old >= 0 && CFHE[index] >= 0) {
                    CFCombinate.push((old) + (CFHE[index]) * (1 - (old)))
                    old = ((old) + (CFHE[index]) * (1 - (old)))
                }
                else if (old < 0 && CFHE[index] < 0) {
                    CFCombinate.push((old) + (CFHE[index]) * (1 + (old)))
                    old = ((old) + (CFHE[index]) * (1 + (old)))
                }
                else {
                    CFCombinate.push(((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
                    old = (((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
                }
            }
            const patient = new Patient({
                idUser,
                namaPenyakit,
                hasilCF: parseFloat((old * 100).toFixed(3)),
                dataCF
            })

            patients.push(patient)
        })

        const response = await Patient.insertMany(patients)
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}

export const addPatient = async (req, res) => {
    try {
        const { idUser, namaPenyakit, dataCF } = req.body
        const penyakit = await Penyakit.findOne({ namaPenyakit })
        const gejalas = penyakit.gejala
        const bobot = await Bobot.findOne()
        const bobotUser = bobot.user
        const CFHE = []

        dataCF.forEach((CF, index) => {
            const cekIdGejala = gejalas.find(gejala => gejala._id == CF.idGejala)
            if (!cekIdGejala) {
                throw new Error('id gejala tidak ditemukan!');
            }
            gejalas.forEach((gejala) => {
                if (CF.idGejala == gejala._id) {
                    const ket = bobotUser.find(bobot => bobot.nilai == dataCF[index].CFUser)
                    dataCF[index].ket = (ket.ket)
                    dataCF[index].gejala = (gejala.gejala)
                    // dataCF[index].CFAdmin = (gejala.role)
                    CFHE.push(parseFloat((gejala.role * dataCF[index].CFUser).toFixed(2)))
                }
            })
        })
        const CFCombinate = []
        let old = CFHE[0]
        for (let index = 1; index < CFHE.length; index++) {
            if (old >= 0 && CFHE[index] >= 0) {
                CFCombinate.push((old) + (CFHE[index]) * (1 - (old)))
                old = ((old) + (CFHE[index]) * (1 - (old)))
            }
            else if (old < 0 && CFHE[index] < 0) {
                CFCombinate.push((old) + (CFHE[index]) * (1 + (old)))
                old = ((old) + (CFHE[index]) * (1 + (old)))
            }
            else {
                CFCombinate.push(((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
                old = (((old) + (CFHE[index])) / (1 - Math.min(old, CFHE[index])))
            }
        }
        const patient = new Patient({
            idUser,
            namaPenyakit,
            hasilCF: parseFloat((old * 100).toFixed(3)),
            dataCF
        })
        const response = await patient.save()
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}


// const CF_H_E = [0.6, 0.6, 0.8, 0.32, 0.12, 0, -0.24]
// let old = CF_H_E[0]
// for (let index = 1; index < CF_H_E.length; index++) {
//     if (old >= 0 && CF_H_E[index] >= 0) {
//         CFCombinate.push(parseFloat(((old) + (CF_H_E[index]) * (1 - (old))).toFixed(4)))
//         old = (parseFloat(((old) + (CF_H_E[index]) * (1 - (old))).toFixed(4)))
//     }
//     else if (old < 0 && CF_H_E[index] < 0) {
//         CFCombinate.push(parseFloat(((old) + (CF_H_E[index]) * (1 + (old))).toFixed(4)))
//         old = (parseFloat(((old) + (CF_H_E[index]) * (1 + (old))).toFixed(4)))
//     }
//     else {
//         CFCombinate.push(parseFloat((((old) + (CF_H_E[index])) / (1 - Math.min(old, CF_H_E[index]))).toFixed(4)))
//         old = (parseFloat((((old) + (CF_H_E[index])) / (1 - Math.min(old, CF_H_E[index]))).toFixed(4)))
//     }
// }

// const response = {
//     idUser,
//     namaPenyakit,
//     dataCF,
//     CFHE,
//     CFCombinate,
//     hasilCF: `${(old * 100).toFixed(3)} %`
// }