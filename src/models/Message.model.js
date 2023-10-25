const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            id: {
                type: String,
                required: true,
                alias: "sender_id",
            },
            name: {
                type: String,
                required: [true, "name is required, received {VALUE}"],
                minLength: [3, "name length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "name length must be less than or equal to 20, received {VALUE}"],
                alias: "sender_name",
            },
            handle: {
                type: String,
                required: [true, "handle is required, received {VALUE}"],
                minLength: [3, "handle length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "handle length must be less than or equal to 20, received {VALUE}"],
                alias: "sender_handle",
            },
        },
        receiver: {
            id: {
                type: String,
                required: true,
                alias: "receiver_id",
            },
            name: {
                type: String,
                required: [true, "name is required, received {VALUE}"],
                minLength: [3, "name length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "name length must be less than or equal to 20, received {VALUE}"],
                alias: "receiver_name",
            },
            handle: {
                type: String,
                required: [true, "handle is required, received {VALUE}"],
                minLength: [3, "handle length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "handle length must be less than or equal to 20, received {VALUE}"],
                alias: "receiver_handle",
            },
        },
        messageList: {
            type: [String],
            default: [],
        },
        date: {
            type: Date,
            default: Date.now,
        }
    },
    {
        collection: "messageCollection",
        autoIndex: true,
        optimisticConcurrency: true,
        bufferTimeoutMS: 10000,
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
