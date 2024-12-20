import { Bot } from "grammy";
import dotenv from "dotenv";
import { messagesHandler, startHandler, userCallBackHandler } from "./handlers/generalHandlers";
import { loginUserMiddleware } from "./middlewares/authMiddleware";
import logger from "./core/logger";
dotenv.config();

let token = process.env.BOT_TOKEN;

if (!token) {
    console.error("Please provide a BOT_TOKEN environment variable");
    process.exit(1);
}

let bot = new Bot(token);

bot.api.setMyCommands([
    {
        command: "start",
        description: "Start the bot"
    }
]);

bot.use(loginUserMiddleware)

bot.command("start", (ctx) => {
    new Promise(async () => {
        await startHandler(ctx);
    });
});


bot.on("message", async (ctx) => {
    new Promise(async () => {
        try {
            await messagesHandler(ctx);
        } catch (error) {
            logger.error(error.message, {
                section: "bot.ts",
            });

            await ctx.reply("عملیات با خطا مواجه شد❌");
        }
    });
});

bot.on("callback_query:data", async (ctx) => {
    new Promise(async () => {
        try {
            await userCallBackHandler(ctx);
        } catch (error) {
            logger.error(error.message, {
                section: "bot.ts",
            });

            await ctx.reply("عملیات با خطا مواجه شد❌");
        }
    });
});

bot.catch((error) => {
    logger.error(error.message, {
        section: "bot.ts",
    });
});


(async () => {
    let username = (await bot.api.getMe()).username;
    console.log(`Bot @${username} is running`);
    bot.start();
})()