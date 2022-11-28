import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import fb_admin from 'src/main';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware  {
    use(req, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ");
        if (!token) throw new UnauthorizedException("missing token");
        fb_admin.auth().verifyIdToken(token[1], true)
        .then((user) => {
            user.email_verified ? next() : res.status(401).send({ statusCode:401, message: "email not verified", error: "Unauthorized" })
            req.user = { email: user.email, firebase_uid: user.uid, _id: user._id }
        }).catch((_) => {res.status(401).send({ statusCode:401, message: "token error", error: "Unauthorized" })});
    }
}