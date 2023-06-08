/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import dadoDaResposta from './die.js'

const moduleName = 'roll-this-on-a-die'

// -----------------------------------
// Functions
function resultToChatMessage(rollResult) {
    const mapMoodDieFaces = {
        1: 'rage',
        2: 'sarcasm',
        3: 'empty',
        4: 'depressive',
        5: 'sulking',
        6: 'fearful'
    }

    const returnChatMessage = dieSide => {
        console.log('teste matheus', dieSide)
        return `<h1>${game.i18n.localize(
            `roll-this-on-a-die.tips.${mapMoodDieFaces[dieSide]}.title`
        )}</h1>`
    }
    console.log('teste retorno', returnChatMessage(rollResult))
    // ChatMessage.create({
    //     content: returnChatMessage(rollResult)
    // })
}

Hooks.once('init', () => {
    // --------------------------------------------------
    // SETTINGS
    // eslint-disable-next-line no-restricted-globals
    const debouncedReload = debounce(() => location.reload(), 1000) // RELOAD AFTER CHANGE

    // call this with: game.settings.get("roll-this-on-a-die", "theme")
    game.settings.register(moduleName, 'theme', {
        name: game.i18n.localize('roll-this-on-a-die.settings.theme.name'),
        hint: game.i18n.localize('roll-this-on-a-die.settings.theme.hint'),
        scope: 'world',
        type: String,
        choices: {
            'ptbr-black': game.i18n.localize(
                'roll-this-on-a-die.dice.black.label'
            )
        },
        default: 'ptbr-black',
        config: true,
        onChange: debouncedReload
    })
    // location ->      "book": game.i18n.localize('STORYTELLER.Settings.ThemeBook'), //[game.i18n.localize("roll-this-on-a-die.dice.black.name")]: game.i18n.localize("roll-this-on-a-die.dice.black.label"),

    // call this with: game.settings.get("roll-this-on-a-die", "chattip")
    game.settings.register(moduleName, 'chattip', {
        name: 'Dica no Chat',
        hint: 'Vai enviar uma mensagem para o chat explicando a rolagem.',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    })

    // --------------------------------------------------
    // Keybinding
    game.keybindings.register(moduleName, 'roll-this-on-a-die', {
        name: game.i18n.localize('roll-this-on-a-die.keybindings.name'),
        hint: game.i18n.localize('roll-this-on-a-die.keybindings.hint'),
        editable: [{ key: 'KeyH', modifiers: [] }],
        onDown: async () => {
            const roll = await new Roll('1dr').evaluate({ async: true })
            game.dice3d.showForRoll(roll, game.user, true) // to show for all users
            if (game.settings.get('roll-this-on-a-die', 'chattip')) {
                resultToChatMessage(roll.result)
            }
        },
        onUp: () => {},
        restricted: false, // Restrict this Keybinding to gamemaster only?
        reservedModifiers: [],
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    })
    // --------------------------------------------------
}) // END INIT

Hooks.once('init', async () => {
    CONFIG.Dice.terms.h = dadoDaResposta
})

Hooks.on('diceSoNiceRollComplete', chatMessageID => {
    const message = game.messages.get(chatMessageID)
    let omniscientDieMessageFlag = false
    let rollResult

    if (message.isAuthor) {
        message.roll.dice.forEach(dice => {
            if (dice instanceof dadoDaResposta) {
                omniscientDieMessageFlag = true
                dice.results.forEach(res => {
                    rollResult = res.result
                })
            }
        }) // ONLY ONE RESULT

        if (
            omniscientDieMessageFlag &&
            game.settings.get('roll-this-on-a-die', 'chattip')
        ) {
            resultToChatMessage(rollResult)
        }
    } // END MAIN IF
})

Hooks.once('diceSoNiceReady', dice3d => {
    // const dieThemeKey = game.settings.get('roll-this-on-a-die', 'theme')
    // const currentLanguage = game.settings.get('core', 'language')
    // let dieThemePath

    // if (currentLanguage === 'pt-BR') {
    //     // TRANSLATION REQUIRED
    //     dieThemePath = dieThemeKey.replace('en-', 'ptbr-')
    // } else {
    //     dieThemePath = dieThemeKey
    // }

    dice3d.addSystem(
        { id: 'roll-this-on-a-die', name: 'Roll this on a die' },
        false
    )
    dice3d.addDicePreset({
        type: 'd6',
        system: 'roll-this-on-a-die',
        labels: [
            `modules/${moduleName}/images/ptbr-black/d1_rage.png`,
            `modules/${moduleName}/images/ptbr-black/d2_sarcasm.png`,
            `modules/${moduleName}/images/ptbr-black/d3_hollow.png`,
            `modules/${moduleName}/images/ptbr-black/d4_sulking.png`,
            `modules/${moduleName}/images/ptbr-black/d5_fearful.png`,
            `modules/${moduleName}/images/ptbr-black/d6_depress.png`
        ],
        bumpMaps: [
            `modules/${moduleName}/images/d1_background.png`,
            `modules/${moduleName}/images/d2_background.png`,
            `modules/${moduleName}/images/d3_background.png`,
            `modules/${moduleName}/images/d4_background.png`,
            `modules/${moduleName}/images/d5_background.png`,
            `modules/${moduleName}/images/d6_background.png`
        ]
    })
})
