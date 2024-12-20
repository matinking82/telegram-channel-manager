import { Context } from "grammy";
import logger from "../core/logger";
import { cancellOptions, startKeyboard } from "../core/keyboards";
import { getUserState, setUserState } from "../services/userServices";
import { UserState } from "../core/enums";

export const startHandler = async (ctx: Context) => {
    let message = `سلام به ربات مدیریت کانال خوش آمدید\nیکی از گزینه های زیر را انتخاب کنید`;

    await ctx.reply(message, {
        reply_markup: startKeyboard()
    })
}

export const cancelHandler = async (ctx: Context) => {
    const userId = ctx.from.id;

    const state = await getUserState(userId.toString());
    if (!state) {
        await ctx.reply("خطا در دریافت وضعیت شما❌");
        return;
    }

    logger.info(`User ${userId} is trying to cancel in state : ${state}`);

    const setState = await setUserState(userId.toString(), UserState.start);
    if (!setState.success) {
        await ctx.reply(setState.message)
        return;
    }

    await startHandler(ctx);
}

export const messagesHandler = async (ctx: Context) => {
    const getState = await getUserState(ctx.from.id.toString());
    if (!getState.success) {
        await ctx.reply('مشکلی پیش آمد ❌');
        return;
    }

    let state = getState.state

    const text = ctx.message?.text;
    if (text === cancellOptions.cancell) {
        return await cancelHandler(ctx)
    }

    if (state === UserState.start) {
        switch (text) {

        }
    }

    logger.info(`User ${ctx.from.id} sent a message in state : ${getState}`);

    switch (state) {
        case UserState.start:
            await ctx.reply('متوجه منظور شما نشدم ❌');
            return await startHandler(ctx);

    }
}

export const userCallBackHandler = async (ctx: Context) => {
    let userId = ctx.from?.id as number;
    let callBackQ = ctx.callbackQuery?.data.split("_");

    logger.info(
        `User ${userId} sent a callback query: ${ctx.callbackQuery?.data}`
    );

    switch (callBackQ[0]) {
        
    }
}