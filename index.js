require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
var moment = require('moment')

var channel = null
var timerContador = null
var segundos = 0
var pomoAtual = 0
var dataHoraInicio = null
var ordem = [ 45, 4, 45, 4, 45, 4, 45, 10 ]

client.on("ready", () => {
    channel = client.channels.cache.get(process.env.CHANNEL_ID)
})

function startPomodoro () {
    if (timerContador) {
        enviaMensagem('O Pomodoro já está em execução!')
        statusPomodoro()
    } else {
        segundos = 0
        pomoAtual = 0
        dataHoraInicio = moment()
        timerContador = setInterval (contador, 1000)
        enviaMensagem('@everyone Pomodoro iniciado!')
    }
}

function stopPomodoro () {
    if (timerContador) {
        clearInterval(timerContador)
        timerContador = null
        enviaMensagem('@everyone Pomodoro finalizado!')
    } else {
        enviaMensagem('O Pomodoro não foi iniciado!')
    }
}

function statusPomodoro () {
    if (timerContador) {
        enviaMensagem('Tempo restante é ' + tempoRestante() + ' minutos')
    } else {
        enviaMensagem('O Pomodoro não foi iniciado!')
    }
}

function tempoRestante () {
    let diferenca = moment().diff(dataHoraInicio, 'minutes')
    return ordem[pomoAtual] - diferenca
}

function enviaMensagem (msg) {
    channel.send(msg)
}

function contador () {
    segundos++
    let minutosAtuais = Math.floor(segundos / 60)
    if (minutosAtuais >= ordem[pomoAtual]) {
        pomoAtual++
        segundos = 0
        dataHoraInicio = moment()

        let msg = (ordem[pomoAtual] || ordem.slice(-1)[0]) < ordem[pomoAtual - 1]
                    ? `@everyone Pomodoro de ${ordem[pomoAtual]} minutos`
                    : '@everyone Fim pomodoro'
        
        enviaMensagem(msg)

        if (pomoAtual >= ordem.length) {
            pomoAtual = 0
        }
    }
}

client.on('message', msg => {
    if (msg.content === '@statusPomodoro') {
        statusPomodoro()
    } else if (msg.content === '@startPomodoro') {
        startPomodoro()
    } else if (msg.content === '@stopPomodoro') {
        stopPomodoro()
    } else if (msg.content === '@helpPomodoro') {
        msg.reply("\nComandos do PomoD:\n@startPomodoro - Inicia o serviço.\n@stopPomodoro - Finaliza o serviço.\n@statusPomodoro - Informa o status do serviço.")
    }
})

client.login(process.env.TOKEN_BOOT)