import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import fb_admin from 'src/main';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware  {
    constructor(private usersRepositoty: UsersRepository) {}

    use(req, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ");
        if (!token) throw new UnauthorizedException("missing token");
        fb_admin.auth().verifyIdToken(token[1], true)
        .then(async (user) => {
            //user.email_verified ? next() : next()
            const me = await this.usersRepositoty.getMe(user.email);
            req.user = { email: user.email, firebase_uid: user.uid, userId: me.id, pilotId: me.pilot_id }
            next();
        }).catch((_) => {res.status(401).send({ statusCode:401, message: "token error", error: "Unauthorized" })});
    }
}