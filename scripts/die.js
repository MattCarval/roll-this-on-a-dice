// eslint-disable-next-line no-undef
export default class dadoDaResposta extends Die {
    constructor(termData) {
        // eslint-disable-next-line no-param-reassign
        termData.faces = 6
        super(termData)
    }

    static DENOMINATION = 'h'
}
