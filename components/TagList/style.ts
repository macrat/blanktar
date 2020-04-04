import css from 'styled-jsx/macro';


export const {className, styles} = css.resolve`
    & {
        color: var(--colors-bg);
        background-color: transparent;
        text-decoration: none;
        display: inline-block;
        padding: 2px 4px;
        margin: 0;
        border: 0;
        font: inherit;
        cursor: pointer;
        position: relative;
    }

    :global(li:hover) > &, :global(li:focus-within) > & {
        color: var(--colors-fg);
    }
`;
