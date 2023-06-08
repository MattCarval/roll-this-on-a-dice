/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

export default class dadoDaResposta extends Die {
    constructor(termData) {
        termData.faces = 6
        super(termData)
    }

    /* -------------------------------------------- */
    /** @override */
    static DENOMINATION = 'h'
}
