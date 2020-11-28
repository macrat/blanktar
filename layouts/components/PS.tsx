import { FC } from 'react';


export type Props = {
    date: string;
    level: 1 | 2 | 3 | 4 | 5;
};

type HeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';


const date2printable = (date: string) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


const PS: FC<Props> = ({ date, level, children }) => {
    const Heading = `h${Math.min(6, level + 1)}` as HeadingTag;

    return (
        <ins dateTime={date}>
            <section>
                <Heading><time dateTime={date}>{date2printable(date)}</time> 追記</Heading>

                {children}
            </section>

            <style jsx>{`
                section {
                    border: .2mm solid var(--colors-dark-fg);
                    padding: 3mm 4mm 0;
                    margin: 2mm 0;
                    position: relative;
                }
                h1, h2, h3, h4, h5, h6 {
                    margin: 0 0 2mm;
                    font-size: inherit;
                    font-weight: 300;
                }
                ins {
                    display: block;
                    margin: 3mm 0;
                    text-decoration: none;
                }
            `}</style>
        </ins>
    );
};


export default PS;
