const UserModel = require("../models/UserModel")

const unblock = (days, id) => {
    const seconds = days * 86400 * 1000

    return setTimeout(() => {
        UserModel.findByIdAndUpdate({ _id: id, blocked: false })
    }, seconds)
}

module.exports = {
    unblock
}