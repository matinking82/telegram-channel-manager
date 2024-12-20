import { UserState } from "../core/enums";
import logger from "../core/logger";
import dbContext from "./dbContext";


export const getUser = async (id: string) => {
    try {
        let user = await dbContext.user.findUnique({
            where: {
                telegramId: id
            }
        });

        if (!user) {
            return {
                success: true,
                message: "User not found",
                data: null
            }
        }

        return {
            success: true,
            data: user
        }
    } catch (error) {
        logger.error(error, {
            section: "getUser"
        });

        return {
            success: false,
            message: "An error occurred while fetching user"
        }
    }
}

export const createUser = async (id: string, state: UserState = UserState.start) => {
    try {
        let user = await dbContext.user.create({
            data: {
                telegramId: id,
                status: state.valueOf()
            }
        });

        return {
            success: true,
            data: user
        }
    } catch (error) {
        logger.error(error, {
            section: "createUser"
        });

        return {
            success: false,
            message: "An error occurred while creating user"
        }
    }
}

export const getUserData = async (id: string) => {
    try {
        let user = await getUser(id);

        if (!user.success) {
            return user;
        }

        let data = {} as any

        if (user.data.dataJson) {
            data = JSON.parse(user.data.dataJson);
        }

        return {
            success: true,
            data: data
        }
    } catch (error) {
        logger.error(error, {
            section: "getUserData"
        });

        return {
            success: false,
            message: "An error occurred while fetching user data"
        }
    }
}

export const setUserData = async (id: string, data: any) => {
    try {
        let user = await getUser(id);

        if (!user.success) {
            return user;
        }

        let updatedUser = await dbContext.user.update({
            where: {
                telegramId: id
            },
            data: {
                dataJson: JSON.stringify(data)
            }
        });

        return {
            success: true,
            data: updatedUser
        }
    } catch (error) {
        logger.error(error, {
            section: "setUserData"
        });

        return {
            success: false,
            message: "An error occurred while setting user data"
        }
    }
}

export const getUserState = async (id: string) => {
    try {
        let user = await getUser(id);

        if (!user.success || !user.data) {
            return {
                success: false,
                message: user.message
            };
        }

        return {
            success: true,
            state: UserState[user.data.status] as UserState
        }
    } catch (error) {
        logger.error(error, {
            section: "getUserState"
        });

        return {
            success: false,
            message: "An error occurred while fetching user state"
        }
    }
}

export const setUserState = async (id: string, state: UserState) => {
    try {
        let user = await getUser(id);

        if (!user.success) {
            return user;
        }

        let updatedUser = await dbContext.user.update({
            where: {
                telegramId: id
            },
            data: {
                status: state.valueOf()
            }
        });

        return {
            success: true,
            data: updatedUser
        }
    } catch (error) {
        logger.error(error, {
            section: "setUserState"
        });

        return {
            success: false,
            message: "An error occurred while setting user state"
        }
    }
}  