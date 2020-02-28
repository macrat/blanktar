const Polygon = () => (
    <svg width="300" height="300">
        <polygon stroke="black" fill="none" points={`${[...new Array(12)].map((_, i) => (
            `${Math.sin(i * 2*Math.PI/12) * 150 + 150},${Math.cos(i * 2*Math.PI/12) * 150 + 150}`
        )).join(', ')}`} />
    </svg>
);


export default Polygon;
