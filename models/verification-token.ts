import mongoose, { Document, Schema } from "mongoose";

interface IVerificationToken extends Document {
    email: string;
    token: string;
    expires: Date
}

const VerificationTokenSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
})

const VerificationToken = mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema)

export default VerificationToken;