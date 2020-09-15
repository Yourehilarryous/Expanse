const mongoose = require("mongoose")

const AnimeSchema = new mongoose.Schema({
    title: {
        type: String
    },
    art: {
        type: String
    },
    synopsis: {
        type: String
    }
})

const Anime = mongoose.model('Anime', AnimeSchema)

module.exports = Anime