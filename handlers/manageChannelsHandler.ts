import { Context, InlineKeyboard } from "grammy";
import { setUserState } from "../services/userServices";
import { UserState } from "../core/enums";
import { cancellKeyboard } from "../core/keyboards";
import logger from "../core/logger";
import { addChannelForUser, getChannelsForUser } from "../services/channelServices";
import { startHandler } from "./generalHandlers";

export const addChannelHandler = async (ctx: Context) => {
    let userId = ctx.from.id.toString();
    let userState = await setUserState(userId, UserState.addChannelEnterId);

    if (!userState.success) {
        await ctx.reply(userState.message);
        return;
    }

    await ctx.reply(`ابتدا مطمئن شوید که ربات به عنوان ادمین به کانال شما اضافه شده باشد\nسپس آیدی کانال خود را ارسال کنید\n\nمثال : @channelId`, {
        reply_markup: cancellKeyboard()
    });
}

export const addChannelEnterIdHandler = async (ctx: Context) => {
    let text = ctx.message?.text;

    let stripped = text?.replace(' ', '');

    let chat = await ctx.api.getChat(stripped);

    if (!chat || chat.type !== "channel") {
        await ctx.reply("کانال یافت نشد");
        return;
    }

    let channelId = chat.id.toString();

    try {
        let message = await ctx.api.sendMessage(channelId, "کانال شما با موفقیت اضافه شد\nمیتوانید این پیام را پاک کنید");
        await ctx.api.deleteMessage(channelId, message.message_id);
    } catch (error) {
        return await ctx.reply("خطا در ارسال پیام به کانال\nچک کنید دسترسی ادمین به ربات داده شده باشد");
    }

    logger.info(`Channel ${channelId} added by user ${ctx.from.id}`);

    let userId = ctx.from.id.toString();

    let result = await addChannelForUser(userId, channelId);

    if (!result.success) {
        await ctx.reply(result.message);
        return;
    }


    let setState = await setUserState(userId, UserState.start);

    if (!setState.success) {
        await ctx.reply(setState.message);
        return;
    }

    await ctx.reply("کانال با موفقیت اضافه شد");

    await startHandler(ctx);
}

export const myChannelsHandler = async (ctx: Context) => {
    let userId = ctx.from.id.toString();

    let getChannels = await getChannelsForUser(userId);

    if (!getChannels.success) {
        await ctx.reply(getChannels.message);
        return;
    }

    if (getChannels.channels.length === 0) {
        let message = `شما هیچ کانالی اضافه نکرده اید`;
        return await ctx.reply(message);
    }

    let message = `کانال خود را انتخاب کنید`;

    let kb = new InlineKeyboard();

    for (let channel of getChannels.channels) {
        let chat = await ctx.api.getChat(channel.chatId);

        let username = chat.username;

        kb.text(username, `channel_${channel.chatId}`);
    }

    await ctx.reply(message, {
        reply_markup: kb
    });
}