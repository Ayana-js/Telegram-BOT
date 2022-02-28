const {gameOptions, againOptions} = require('./options')
const TelegramApi = require('node-telegram-bot-api')

const token = '5137210903:AAEuKk7rqTW3Ik1bK1fYt519Gchm9DB7lWQ'

const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю тебе цифру от 0 до 9, а ты должен отгадать ее!`)
    const randomNumber =( Math.floor(Math.random() * 10))
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([ 
        {command: '/start', description: 'Initial'},
        {command: '/info', description: 'Information'},
        {command: '/game', description: `Let's play`}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8df/4d8/8df4d8fc-5fcc-3713-b3cb-46cf18cbc342/12.webp')
            return bot.sendMessage(chatId, 'Welcome')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `You are ${msg.from.first_name}`)
        }
        if (text === '/game') {
           return startGame(chatId)
        }
        return bot.sendMessage(chatId, `I don't understand you, ${msg.from.first_name}`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id 
        if (data ==='/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions) 
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, я загадал цифру ${chats[chatId]}`, againOptions )
            }
    })
}

start()