import {FC} from 'react';


export type Props = {
    date: string,
};


const PS: FC<Props> = ({date, children}) => {
    return (
        <ins dateTime={date}>
            <section>
                <h5><time dateTime={date}>{date}</time>追記</h5>

                {children}
            </section>

            <style jsx>{`
                section {
                    border-left: .2mm solid var(--colors-dark-fg);
                    padding-left: 5mm;
                    margin-left: 2mm;
                }
                h5 {
                    margin: 0;
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
