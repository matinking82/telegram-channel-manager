import { Bot } from "grammy";
import dotenv from "dotenv";
import { startHandler } from "./handlers/generalHandlers";
import { loginUserMiddleware } from "./middlewares/authMiddleware";
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

(async () => {
    let username = (await bot.api.getMe()).username;
    console.log(`Bot @${username} is running`);
    bot.start();
})()