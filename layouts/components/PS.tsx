import { FC } from 'react';


export type Props = {
    date: string;
};


const date2printable = (date: string) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


const PS: FC<Props> = ({ date, children }) => (
    <ins dateTime={date}>
        <section>
            <h1><time dateTime={date}>{date2printable(date)}</time> 追記</h1>

            {children}
        </section>

        <style jsx>{`
            section {
                border: .2mm solid var(--colors-dark-fg);
                padding: 7mm 5mm 2mm;
                margin: 2mm 0;
                position: relative;
            }
            h1 {
                margin: 0;
                font-size: inherit;
                font-weight: 300;
                position: absolute;
                top: 2mm;
                left: 3mm;
            }
            ins {
                display: block;
                margin: 3mm 0;
                text-decoration: none;
            }
        `}</style>
    </ins>
);


export default PS;
