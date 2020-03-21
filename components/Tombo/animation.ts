import css from 'styled-jsx/macro';


export default css.resolve`
    .vertical {
        stroke-dasharray: 6;
        animation: vertical-draw .6s ease both;
    }
    @keyframes vertical-draw {
        from { stroke-dashoffset: 6; }
          to { stroke-dashoffset: 0; }
    }
    .horizontal {
        stroke-dasharray: 15;
        animation: horizontal-draw .6s ease both;
    }
    @keyframes horizontal-draw {
        from { stroke-dashoffset: 15; }
          to { stroke-dashoffset: 0; }
    }
    polyline {
        stroke-dasharray: 20;
        animation: polyline-draw .6s ease both;
    }
    @keyframes polyline-draw {
        from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
    }

    :global(div.loading) .vertical {
        animation: vertical-erase .6s ease both;
    }
    @keyframes vertical-erase {
        from { stroke-dashoffset: 12; }
          to { stroke-dashoffset: 6; }
    }
    :global(div.loading) .horizontal {
        animation: horizontal-erase .6s ease both;
    }
    @keyframes horizontal-erase {
        from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 15; }
    }
    :global(div.loading) polyline {
        animation: polyline-erase .6s ease both;
    }
    @keyframes polyline-erase {
        from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 20; }
    }

    @media screen and (prefers-reduced-motion: reduce) {
        .horizontal,
        .vertical,
        polyline,
        :global(div.loading) .horizontal,
        :global(div.loading) .vertical,
        :global(div.loading) polyline {
            animation: none;
        }
    }
`;
