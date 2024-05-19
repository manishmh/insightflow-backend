import User from '../models/user'

export const findUserByEmail = (email: string) => {
    try {
        const user = User.findOne({ email })

        return user;
    } catch (error) {
       return null; 
    }
}

export const findUserById = (id: string | undefined) => {
    try {
        const user = User.findById(id);

        return user;
    } catch (error) {
        return null; 
    }
}