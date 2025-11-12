import mongoose from "mongoose";

const ConnectionRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The user who sent the request
        required: true,
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // The user who receives the request
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionRequestSchema);

export default ConnectionRequest;
