import preval from 'preval.macro';


export const FONT_STYLE_SHEET: string = preval`
    module.exports = require('./loader').load();
`;
