const mongoose = require('mongoose');
const xemaySchema = mongoose.Schema({
    ten_ph43159: {
        type: String,
        required: true
    },
    mau_ph43159: {
        type: String,
        required: true
    },
    gia_ph43159: {
        type: Number,
        required: true,
        default: 0
    },
    mota_ph43159: {
        type: String
    },
    anh_ph43159: {
        type: String
    }
})

module.exports = mongoose.model('xemay', xemaySchema)