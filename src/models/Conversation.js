const mongoose = require("mongoose");

const Schema = mongoose.Schema;

export const ConversationSchema = new Schema(
    {
        members: {
            type: Array,
        },
        annonceId: {
            type: Schema.ObjectId,
            ref: 'annonces',
            required: 'id annonce obligatoire'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);