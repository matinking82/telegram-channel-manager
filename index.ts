import { Bot } from "grammy";
import dotenv from "dotenv";
dotenv.config();

let token = process.env.BOT_TOKEN;

if (!token) {
    console.error("Please provide a BOT_TOKEN environment variable");
    process.exit(1);
}

let bot = new Bot(token);


bot.command("start", (ctx) => {
    ctx.reply("Hello, world!");
});

(async () => {
    let username = (await bot.api.getMe()).username;
    console.log(`Bot @${username} is running`);
    bot.start();
})()