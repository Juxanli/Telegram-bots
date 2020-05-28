const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const fs = require('fs')
const _ = require('lodash')

const TOKEN = '1152851566:AAE_oUb4pW-v44mSvhMCdSIjLwfdULEazDE'


const bot = new TelegramBot(TOKEN, {
  polling: true
})

const KB = {
  namaz: 'Намоз вақти',
  suralar: 'Қурон суралари',
  falaq: 'Фалак сураси',
  ixlos: 'Ихлос сураси',
  fotixa: 'Фотиха сураси',
  kavsar: 'Кавсар сураси',
  back: 'Оркага қактиш'
}

const PicScrs = {
  [KB.falaq]: [
    'falaq.jpg'
  ],
  [KB.ixlos]: [
    'ixlos.jpg'
  ],
  [KB.fotixa]: [
    'fotixa.jpg'
  ],
  [KB.kavsar]: [
    'kavsar.jpg'
  ]
}

bot.onText(/\/start/, msg => {
  sendGreeting(msg)
  
})

bot.on('message', msg =>{

  switch (msg.text) {
    case KB.suralar:
      sendPictureScreen(msg.chat.id)
      break
    case KB.namaz:
      sendCurrencyScreen(msg.chat.id)
      break
    case KB.back:
      sendGreeting(msg, false)
      break
    case KB.falaq:
    case KB.ixlos:
    case KB.fotixa:
    case KB.kavsar:
      sendpictureByName(msg.chat.id, msg.text)
      break
  }

})

bot.on('callback_query', query => {
  //console.log(JSON.stringify(query, null, 2));

  const base = query.data
  const symbol5 = 'bamdat'
  const symbol6 = 'ishraq'
  const symbol = 'kun'
  const symbol1 = 'besin'
  const symbol2 = 'ekindi'
  const symbol3 = 'aqsham'
  const symbol4 = 'quptan'
  const symbol8 = 'islamic_date'
  const symbol9 = 'date'
  const symbol10 ='CityName'

  bot.answerCallbackQuery({
    callback_query_id: query.id,
    text: `Vi vibrali ${base}`
  })
  
  //request(`http://data.fixer.io/api/latest?access_key=d89dde07b129eea229f4ffca9b2e0efb&symbols&base`)

  //request(`http://data.fixer.io/api/latest?access_key=d89dde07b129eea229f4ffca9b2e0efb&symbols=${symbol}&base=${base}`, (error, response, body)
  request(`https://namaztimes.kz/api/praytimes?id=20720&symbol=${symbol}&base=${base}`, (error, response, body) => {

  if (error) throw new Error(error)

  if (response.statusCode === 200) {

    const namaztime = JSON.parse(body)
    //console.log(currencyData);

    const html = `<b>${'Шахар'}</b> - <em>${namaztime.attributes[symbol10]} ${symbol10}</em>\n
      <b>${'Сана'}</b> - <em>${namaztime[symbol9]} ${symbol9}</em>\n
      <b>${'Ислом тақвими санаси'}</b> - <em>${namaztime[symbol8]} ${symbol8}</em>\n

      <b>${'Тонг'}</b> - <em>${namaztime.praytimes[symbol5]} ${symbol5}</em>\n
      <b>${'Бомдод'}</b> - <em>${namaztime.praytimes[symbol]} ${symbol}</em>\n
      <b>${'Куёш'}</b> - <em>${namaztime.praytimes[symbol6]} ${symbol6}</em>\n
      <b>${'Пешин'}</b> - <em>${namaztime.praytimes[symbol1]} ${symbol1}</em>\n
      <b>${'Асир'}</b> - <em>${namaztime.praytimes[symbol2]} ${symbol2}</em>\n
      <b>${'Шом'}</b> - <em>${namaztime.praytimes[symbol3]} ${symbol3}</em>\n
      <b>${'Хуфтон'}</b> - <em>${namaztime.praytimes[symbol4]} ${symbol4}</em>\n `
    
    

    bot.sendMessage(query.message.chat.id, html, {
    parse_mode: 'HTML'
    })
    
  }

  })

})

function sendPictureScreen (chatId) {
  bot.sendMessage(chatId, `Сурани танланг: `, {
    reply_markup: {
      keyboard: [
        [KB.falaq, KB.ixlos, KB.fotixa, KB.kavsar],
        [KB.back]
      ]
    }
  })
}

function sendGreeting(msg, sayHello = true) {
  const text = sayHello
  ? `Ассалому Алейкум, ${msg.from.first_name}\nНамоз вақтини билишни истайсизми?`
  : `Намоз вақтини билишни истайсизми?`

  bot.sendMessage(msg.chat.id, text, {
    reply_markup: {
      keyboard: [
        [KB.namaz, KB.suralar]
      ]
    }
  })
}

function sendpictureByName(chatId, picName) {
  const srcs = PicScrs[picName]

  const src = srcs[_.random(0, srcs.length - 1)]

  bot.sendMessage(chatId, 'Юклаяпман....')

  fs.readFile(`${__dirname}/pictures/${src}`, (error, picture) => {
    if (error) throw new Error(error)

    bot.sendPhoto(chatId, picture).then(() => {
      bot.sendMessage(chatId, 'Юклади!')
    })
  })
}

function sendCurrencyScreen(chatId) {

  bot.sendMessage(chatId, `Намоз укиш вакти:`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Намоз вактини билиш',
            callback_data: 'praytimes'
          }
        ]
      ]
    }
  })

}