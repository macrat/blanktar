import {FC} from 'react';


export type Props = {
    date: string,
};


const date2printable = (date: string) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


const PS: FC<Props> = ({date, children}) => {
    return (
        <ins dateTime={date}>
            <section>
                <h5><time dateTime={date}>{date2printable(date)}</time> 追記</h5>

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
