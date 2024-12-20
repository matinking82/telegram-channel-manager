import { Keyboard } from "grammy"

export const cancellOptions = {
    cancell: "انصراف",
}

export const cancellKeyboard = () => {
    let kb = new Keyboard()

    for (let key in cancellOptions) {
        kb.text(cancellOptions[key])
    }

    kb.resize_keyboard = true;

    return kb
}

export const startKeyboardOptions = {
    addChannel: "افزودن کانال",
    myChannels: "کانال های من",
}

export const startKeyboard = () => {
    let kb = new Keyboard()

    for (let key in startKeyboardOptions) {
        kb.text(startKeyboardOptions[key])
    }
    kb.resize_keyboard = true;

    return kb
}