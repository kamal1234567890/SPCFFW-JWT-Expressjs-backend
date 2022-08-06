import Users from '../models/UsersModel.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

export const getUsers = async (req, res) => {
    try {
        const users = await Users.find().select('fullName dateBirth email')

        res.json(users)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const Register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        const { fullName, dateBirth, email, password, confPassword } = await req.body

        try {
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt)

            await Users.insertMany({
                fullName,
                dateBirth,
                email,
                password: hashPassword
            })
            res.json({ msg: 'Register Berhasil' })
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }

}

export const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ msg: errors.array()[0].msg })
    } else {
        try {
            const user = await Users.findOne({ email: req.body.email })
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) return res.status(400).json({ msg: "Wrong Password" })
            const _id = user._id
            const fullName = user.fullName
            const dateBirth = user.dateBirth
            const email = user.email
            const role = user.role
            const accessToken = jwt.sign({ _id, fullName, dateBirth, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
            const refreshToken = jwt.sign({ _id, fullName, dateBirth, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
            await Users.updateOne({ _id }, {
                $set: {
                    refresh_token: refreshToken
                }
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ accessToken })
        } catch (error) {
            res.status(404).json({ msg: error })
        }
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findOne({ refresh_oken: refreshToken })
    if (!user) return res.sendStatus(204)
    await Users.updateOne({ _id: user._id }, {
        $set: {
            refresh_oken: null
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)

}