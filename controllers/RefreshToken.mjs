import Users from '../models/UsersModel.mjs'
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await Users.findOne({ refresh_token: refreshToken })
        if (!user) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const userId = user._id
            const fullName = user.fullName
            const dateBirth = user.dateBirth
            const email = user.email
            const role = user.role
            const updatedAt = user.updatedAt
            const accessToken = jwt.sign({ userId, fullName, dateBirth, email, role, updatedAt }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
            res.json({ accessToken })
        })
    } catch (error) {
        console.info(error)
    }
}
export const refreshTokenAdmin = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await Users.findOne({ refresh_token: refreshToken })
        if (!user) return res.sendStatus(403)
        if (user.role === 'user') return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const userId = user._id
            const fullName = user.fullName
            const dateBirth = user.dateBirth
            const email = user.email
            const role = user.role
            const updatedAt = user.updatedAt
            const accessToken = jwt.sign({ userId, fullName, dateBirth, email, role, updatedAt }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
            res.json({ accessToken })
        })
    } catch (error) {
        console.info(error)
    }
}