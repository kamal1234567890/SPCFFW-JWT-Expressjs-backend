import Bobot from '../models/BobotModel.mjs'

export const getBobotUser = async (req, res) => {
    try {
        const { select = 'user' } = req.query
        const bobot = await Bobot.findOne()
        const bobotUser = bobot.user
        const bobotAdmin = bobot.admin

        if (select == 'admin') {
            res.json(bobotAdmin)
        } else if (select == 'user') {
            res.json(bobotUser)
        } else {
            res.status(400).json({ msg: 'select is not found' })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}