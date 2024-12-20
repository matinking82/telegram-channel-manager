import { Context, NextFunction } from "grammy";
import logger from "../core/logger";
import { createUser, getUser } from "../services/userServices";

export const loginUserMiddleware = async (ctx: Context, next: NextFunction) => {
    new Promise(async () => {
        let user = ctx.from;

        if (!user) {
            logger.info("User is null in loginUserMiddleware", {
                section: "UserLoginMiddleware",
            });
            return;
        }

        let checkLogin = await getUser(user.id.toString());

        if (!checkLogin.success) {
            logger.error(checkLogin.message, {
                section: "UserLoginMiddleware",
            });
            await ctx.reply(checkLogin.message);
            return;
        }

        if (checkLogin.data) {
            return next();
        }

        logger.info(`User is not logged in, creating user ${user.id}`, {
            section: "UserLoginMiddleware",
        });
        let createdUser = await createUser(user.id.toString());

        if (!createdUser.success) {
            logger.error(createdUser.message);
            await ctx.reply(createdUser.message);
            return;
        }

        logger.info(`User created ${user.id}`, {
            section: "UserLoginMiddleware",
        });
        return next();
    });
};