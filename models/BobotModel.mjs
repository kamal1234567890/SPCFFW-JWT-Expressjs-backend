import mongoose from 'mongoose'

const Bobot = mongoose.model('Bobot', {
    admin: [],
    user: [],
})

export default Bobot