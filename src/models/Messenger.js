const mongoose = require("mongoose");

const Schema = mongoose.Schema;

export const MessageSchema = new Schema(
    {
        conversationId: {
            type: String
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
        ckeck: {
            type: Boolean,
        },
        interactif: {
            type: Boolean,
        },
        etatInteractif: {
            type: Number, //0: en attente, 1: modifier
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);