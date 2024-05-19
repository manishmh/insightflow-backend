import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    loginDevices: { deviceInfo: string, lastLogin: Date }[];
    updatedAt: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
    loginDevices: [{
        deviceInfo: String,
        lastLogin: Date
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: function(this: IUser) {
            if (this.isNew) {
                return new Date();
            } else {
                return this.createdAt;
            }
        }
    }
})

const User = mongoose.model<IUser>('User', UserSchema);

export default User;