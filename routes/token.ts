import express, { Request, Response } from 'express'
import User from '../models/user'
import Jwt, { Secret } from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import generateAccessToken from '../components/generate-access-token'

dotenv.config()

const TokenRouter = express.Router()

TokenRouter.get('/', (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.refreshToken){
        return res.status(401).json({message: "No refresh Token"})
    }
    const refreshToken = cookies.refreshToken;

    const foundUser = User.findOne({ refreshToken })

    if (!foundUser) {
        return res.status(403).json({ status: "failed",  message: "invalid refresh token"})
    }

    Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ status: "failed",  message: "invalid refresh token"})
        }

        const userMail = user.email
        const accessToken = generateAccessToken(userMail)

        res.cookie('accessToken', accessToken, { httpOnly: true })
        res.status(200).json({
            status: "success",
            user: user.email,
            data: {
                accessToken
            }
        })
    })
})

export default TokenRouter; 