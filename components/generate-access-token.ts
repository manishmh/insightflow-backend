import jwt, { Secret } from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

const generateAccessToken = (email: string) => {
    const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET as Secret, { expiresIn: '1h' });

    return accessToken;
}

export default generateAccessToken 