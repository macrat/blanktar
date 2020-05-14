import React, {FC} from 'react';

import ShareButton from './ShareButton';
import {getImageURL} from '~/lib/eyecatch';


export type Props = {
    title: string;
    href: string;
    image?: string;
};


const SocialShare: FC<Props> = ({title, href, image}) => (
    <ul aria-label="SNSでシェアする">
        <li><ShareButton label="Facebook" alt="Facebookでいいねする" href={`https://www.facebook.com/share.php?u=${encodeURIComponent(href)}`}>
            <path d="M 202.92927,512 V 298.65565 h -77.51904 v -88.25238 h 77.51904 v -67.26279 c 0,-76.517211 45.58001,-118.782938 115.31851,-118.782938 33.40296,0 68.34199,5.962891 68.34199,5.962891 v 75.133837 h -38.49833 c -37.92649,0 -49.75413,23.5343 -49.75413,47.67844 v 57.27056 h 84.67466 l -13.53602,88.25238 H 298.33731 V 512" />
        </ShareButton></li>

        <li><ShareButton label="Twitter" alt="twitterでツイートする" href={`https://twitter.com/share?url=${encodeURIComponent(href)}&text=${title}&via=macrat_jp`}>
            <path d="m 161.01377,464.01325 c 193.20832,0 298.88511,-160.07167 298.88511,-298.88512 0,-4.54655 0,-9.07264 -0.3072,-13.57823 A 213.72928,213.72928 0 0 0 512,97.1755 209.67424,209.67424 0 0 1 451.66592,113.70286 105.41056,105.41056 0 0 0 497.84832,55.6011 210.51392,210.51392 0 0 1 431.14497,81.0987 105.14432,105.14432 0 0 0 252.12928,176.90414 298.22976,298.22976 0 0 1 35.6352,67.151821 105.12383,105.12383 0 0 0 68.15744,207.37838 104.26368,104.26368 0 0 1 20.48,194.23022 c 0,0.43007 0,0.88064 0,1.3312 a 105.08288,105.08288 0 0 0 84.2752,102.97344 104.87808,104.87808 0 0 1 -47.431681,1.80224 105.1648,105.1648 0 0 0 98.140161,72.94975 210.78016,210.78016 0 0 1 -130.457601,45.056 A 213.83167,213.83167 0 0 1 0,416.82733 297.39007,297.39007 0 0 0 161.01377,463.93134" />
        </ShareButton></li>

        <li><ShareButton label="はてなブックマーク" alt="はてなブックマークで共有する" href={`https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(href)}&title=${title}`}>
            <path d="m 308.92669,274.41488 q -25.52493,-28.52785 -70.94428,-31.90616 c 27.02639,-7.31964 46.54545,-18.01759 58.93255,-32.4692 12.3871,-14.45162 18.39296,-33.40762 18.39296,-57.61877 a 103.22581,103.22581 0 0 0 -12.3871,-50.86217 91.589443,91.589443 0 0 0 -36.03519,-34.909091 c -13.70088,-7.50733 -30.02932,-12.950146 -49.17301,-16.140761 -19.14371,-3.190616 -52.73901,-4.5044 -100.78593,-4.5044 H 0 V 472.42075 h 120.49268 q 72.63342,0 104.72726,-4.87977 c 21.3959,-3.37829 39.22581,-9.00879 53.67743,-16.70381 A 98.533724,98.533724 0 0 0 320,410.67295 c 9.57185,-17.26686 14.45162,-37.34898 14.45162,-60.24633 0,-31.71849 -8.44575,-57.05572 -25.52493,-76.01174 z M 108.10557,140.40902 h 24.96189 q 43.35483,0 58.18181,9.75953 c 9.94721,6.56891 14.82698,17.82991 14.82698,33.78299 0,15.95308 -5.44282,26.27567 -15.95309,32.65689 -10.51025,6.38123 -30.217,9.38416 -58.93254,9.38416 h -23.08505 z m 99.09678,244.55132 c -11.44869,6.94428 -30.96775,10.32258 -58.3695,10.32258 H 108.10557 V 302.37969 H 150.522 c 28.15249,0 47.67155,3.56599 57.99413,10.69796 10.32258,7.13195 15.7654,19.51905 15.7654,37.53665 0,18.0176 -5.6305,27.58944 -17.26687,34.53373 z" />
            <path d="M 457.94722,364.50287 A 54.052786,54.052786 0 1 0 512,418.55565 54.052786,54.052786 0 0 0 457.94722,364.50287 Z" />
            <rect x="411.0264" y="46.004318" width="93.841644" height="284.37772" />
        </ShareButton></li>

        <li><ShareButton label="Pinterest" alt="Pinterestでピンする" href={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(href)}&media=${getImageURL(title, image)}&description=${title}`}>
            <path d="m 256.20996,-1.65e-4 c -141.26322,0 -255.7896683,114.526385 -255.7896683,255.789635 0,108.42112 67.3685003,201.05276 162.5264783,238.31594 -2.31587,-20.21053 -4.21055,-51.36844 0.84208,-73.47372 4.63155,-20.00003 29.89472,-127.15798 29.89472,-127.15798 0,0 -7.57894,-15.36844 -7.57894,-37.89476 0,-35.57898 20.63162,-62.10531 46.31587,-62.10531 21.89471,0 32.42104,16.42107 32.42104,36.00002 0,21.89475 -13.89476,54.73689 -21.26315,85.26322 -6.10526,25.47371 12.84213,46.31583 37.89474,46.31583 45.47372,0 80.42111,-48.00003 80.42111,-117.05272 0,-61.26319 -44.00005,-104.00006 -106.94744,-104.00006 -72.8422,0 -115.57904,54.52635 -115.57904,110.94744 0,21.89475 8.42109,45.4737 18.94738,58.31582 2.10532,2.52633 2.31576,4.84211 1.68424,7.36842 -1.89479,8.00001 -6.31582,25.47371 -7.1579,29.05265 -1.05268,4.6316 -3.78947,5.68422 -8.63166,3.36843 -31.99995,-14.94737 -51.999938,-61.47372 -51.999938,-99.15796 0,-80.63163 58.526288,-154.736938 169.052708,-154.736938 88.63168,0 157.68429,63.157938 157.68429,147.789568 0,88.21057 -55.57897,159.158 -132.63164,159.158 -25.89481,0 -50.31583,-13.4737 -58.5264,-29.4737 0,0 -12.84213,48.84213 -15.99996,60.84213 -5.68426,22.31582 -21.26318,50.10529 -31.78951,67.15792 24.00001,7.36843 49.26318,11.36846 75.78951,11.36846 141.26322,0 255.78967,-114.52639 255.78967,-255.78964 C 511.99948,114.52622 397.47322,-1.65e-4 256.20996,-1.65e-4 Z" />
        </ShareButton></li>

        <li><ShareButton label="LINE" alt="LINEでシェアする" href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(href)}`}>
            <path d="M 256.00133,12.074717 C 114.85336,12.074717 1.875e-5,105.27808 1.875e-5,219.83009 c 0,102.69834 91.07357425,188.70594 214.09830125,204.96589 8.33799,1.79884 19.6913,5.48635 22.55655,12.61724 2.58401,6.47473 1.6853,16.61554 0.82395,23.1488 0,0 -2.99739,18.06588 -3.64779,21.9214 -1.11915,6.46882 -5.14639,25.30691 22.1703,13.79311 27.3284,-11.51379 147.43286,-86.80304 201.14631,-148.62599 h -0.0112 c 37.0961,-40.68793 54.86354,-81.97036 54.86354,-127.82045 0,-114.55201 -114.83575,-207.755373 -256.00129,-207.755373 z M 88.964435,164.46874 H 106.929 c 2.75394,0 4.98678,2.2329 4.98678,4.98685 v 88.58676 h 48.78674 c 2.75392,0 4.97822,2.23286 4.97822,4.9868 v 17.95601 c 0,2.75394 -2.2243,4.99539 -4.97822,4.99539 H 88.964435 c -1.33596,0 -2.548041,-0.53789 -3.450447,-1.39905 -0.01758,-0.0293 -0.04689,-0.041 -0.06856,-0.0604 -0.02931,-0.0293 -0.04102,-0.0621 -0.05982,-0.0856 -0.861335,-0.89062 -1.407664,-2.09732 -1.407664,-3.43327 v -0.0176 -111.52956 c 0,-2.75394 2.238764,-4.9868 4.986844,-4.9868 z m 97.066955,0 h 17.95596 c 2.75393,0 4.98685,2.23017 4.98685,4.97824 v 111.54673 c 0,2.74808 -2.23292,4.97823 -4.98685,4.97823 h -17.95596 c -2.74807,0 -4.98679,-2.23015 -4.98679,-4.97823 V 169.44698 c 0,-2.74807 2.23872,-4.97824 4.98679,-4.97824 z m 45.38772,0 h 17.95602 c 0.0585,0 0.11606,0.0112 0.18046,0.0112 0.0878,0.006 0.16993,0.0112 0.25724,0.0176 0.0878,0.0112 0.16933,0.0176 0.25722,0.0353 0.0643,0.006 0.13534,0.0112 0.20566,0.0235 0.0997,0.0176 0.19805,0.0353 0.29181,0.0599 0.0643,0.0176 0.11303,0.0353 0.17168,0.0527 0.0997,0.0293 0.19804,0.0527 0.2918,0.0943 0.0585,0.0176 0.11303,0.0353 0.17169,0.0604 0.0997,0.0293 0.18926,0.0791 0.28301,0.12003 0.0527,0.0235 0.10206,0.0527 0.15464,0.0772 0.0878,0.0469 0.17811,0.0931 0.26602,0.14587 0.0527,0.0293 0.10782,0.0591 0.15464,0.0944 0.0878,0.0587 0.1752,0.11302 0.25723,0.17167 0.0468,0.0353 0.0878,0.0622 0.12896,0.10321 0.0938,0.0643 0.17813,0.15289 0.26602,0.22325 l 0.0943,0.0856 c 0.0997,0.0938 0.20099,0.19511 0.30061,0.30058 0.006,0.0112 0.0235,0.0293 0.0353,0.041 0.13472,0.15815 0.26894,0.32227 0.38614,0.49805 l 51.12136,69.03396 v -66.27132 c 0,-2.74807 2.22705,-4.97824 4.98684,-4.97824 h 17.94734 c 2.75393,0 4.98686,2.23017 4.98686,4.97824 v 111.54671 c 0,2.74807 -2.23293,4.97823 -4.98686,4.97823 h -17.94734 c -0.45117,0 -0.88048,-0.0604 -1.27893,-0.17169 -0.0235,0 -0.0527,-0.0112 -0.0774,-0.0112 -0.11127,-0.0353 -0.21738,-0.0703 -0.33457,-0.11127 -0.0469,-0.0176 -0.10207,-0.0409 -0.15463,-0.0599 -0.0878,-0.0351 -0.15815,-0.0679 -0.24025,-0.1032 -0.082,-0.0353 -0.16406,-0.0703 -0.24022,-0.11128 -0.0527,-0.0293 -0.0961,-0.0586 -0.13711,-0.0856 -0.1055,-0.0527 -0.20918,-0.11605 -0.3088,-0.18047 -0.0176,-0.0176 -0.0351,-0.0293 -0.0527,-0.0411 -0.47462,-0.32226 -0.9129,-0.72938 -1.27034,-1.22744 l -51.18135,-69.11979 v 66.24481 c 0,2.74807 -2.23286,4.97822 -4.9868,4.97822 h -17.956 c -2.74808,0 -4.98679,-2.23015 -4.98679,-4.97822 V 169.44698 c 0,-2.74807 2.23871,-4.97824 4.98679,-4.97824 z m 123.58894,0 h 0.0176 71.72939 c 2.75399,0 4.9783,2.2329 4.9783,4.98685 v 17.96449 c 0,2.75395 -2.22431,4.98686 -4.9783,4.98686 h -48.78667 v 18.84864 h 48.78667 c 2.75399,0 4.9783,2.23285 4.9783,4.98679 v 17.95594 c 0,2.75982 -2.22431,4.98686 -4.9783,4.98686 h -48.78667 v 18.85718 h 48.78667 c 2.75399,0 4.9783,2.23286 4.9783,4.9868 v 17.95601 c 0,2.75394 -2.22431,4.99539 -4.9783,4.99539 h -71.72939 -0.0176 c -1.34182,0 -2.54264,-0.53789 -3.43328,-1.39905 -0.0293,-0.0112 -0.0598,-0.041 -0.0772,-0.0604 -0.0235,-0.0235 -0.0585,-0.0585 -0.0686,-0.0856 -0.86721,-0.89062 -1.39908,-2.10592 -1.39908,-3.44188 v -0.0113 -111.52957 c 0,-1.33595 0.53498,-2.54257 1.39046,-3.43321 0.0176,-0.0293 0.0469,-0.065 0.0772,-0.0943 0.0176,-0.0176 0.0353,-0.0293 0.0527,-0.0527 0.89649,-0.86722 2.11133,-1.40767 3.459,-1.40767 z" />
        </ShareButton></li>

        <style jsx>{`
            ul {
                display: flex;
                justify-content: center;
                margin: 0;
                padding: 0;
            }
            li {
                display: block;
                margin: 0 2mm;
            }

            @media screen and (max-width: 380px) {
                ul {
                    flex-wrap: wrap;
                    margin: -2mm 0;
                }
                li {
                    margin: 2mm;
                }
            }
            @media print {
                display: none;
            }
        `}</style>
    </ul>
);


export default SocialShare;
