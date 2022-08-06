import mongoose from 'mongoose'

const Users = mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    dateBirth: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    refresh_token: {
        type: String,
        default: null
    },
    role:{
        type: String,
        default: "user"
    }

}, {
    timestamps: true
})

export default mongoose.model('User', Users)