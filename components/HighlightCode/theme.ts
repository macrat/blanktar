import {PrismTheme} from 'prism-react-renderer';


const theme: PrismTheme = {
    plain: {
        color: undefined,
        backgroundColor: undefined,
    },
    styles: [{
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
            color: 'var(--colors-comment)',
            fontStyle: 'italic',
        },
    }, {
        types: ['namespace'],
        style: {
            color: 'var(--colors-namespace)',
        },
    }, {
        types: ['string', 'attr-value'],
        style: {
            color: 'var(--colors-string)',
        },
    }, {
        types: ['punctuation', 'operator'],
        style: {
            color: 'var(--colors-string)',
        },
    }, {
        types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'],
        style: {
            color: 'var(--colors-value)',
        },
    }, {
        types: ['tag', 'atrule', 'keyword', 'attr-name', 'selector'],
        style: {
            color: 'var(--colors-keyword)',
        },
    }, {
        types: ['function', 'deleted', 'tag'],
        style: {
            color: 'var(--colors-function)',
        },
    }, {
        types: ['function-variable'],
        style: {
            color: 'var(--colors-variable)',
        },
    }],
};


export default theme;
