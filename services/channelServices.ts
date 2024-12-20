import logger from "../core/logger"
import dbContext from "./dbContext";

export const addChannelForUser = async (userId: string, channelId: string) => {
    try {
        let fChannel = await dbContext.channel.findFirst({
            where: {
                chatId: channelId,
                userId: userId
            }
        });

        if (fChannel) {
            return {
                success: true,
                message: "Channel already added"
            }
        }

        let channel = await dbContext.channel.create({
            data: {
                chatId: channelId,
                userId: userId,
            }
        });

        return {
            success: true,
            data: channel
        }
    } catch (error) {
        logger.error(error, {
            section: "addChannelForUser"
        });

        return {
            success: false,
            message: "An error occurred while adding channel for user"
        }
    }
}

export const getChannelsForUser = async (userId: string) => {
    try {
        let channels = await dbContext.channel.findMany({
            where: {
                userId: userId
            }
        });

        return {
            success: true,
            channels: channels
        }
    } catch (error) {
        logger.error(error, {
            section: "getChannelsForUser"
        });

        return {
            success: false,
            message: "An error occurred while fetching channels for user"
        }
    }
}