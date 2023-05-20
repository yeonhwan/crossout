import { type CSSProperties } from "react";

type NoListIconProps = {
  className?: string;
  color?: string;
};

const NoListIcon = ({ className, color }: NoListIconProps) => {
  const styleObject: CSSProperties = {
    fill: "none",
    stroke: color ? color : "black",
    strokeWidth: "20",
    strokeOpacity: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeMiterlimit: "22.926",
    strokeDasharray: "none",
  };

  return (
    <svg
      version="1.1"
      id="svg2541"
      xmlSpace="preserve"
      width="682.66669"
      height="682.66669"
      viewBox="0 0 682.66669 682.66669"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs id="defs2545">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath2555">
          <path d="M 0,512 H 512 V 0 H 0 Z" id="path2553" />
        </clipPath>
      </defs>
      <g id="g2547" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)">
        <g id="g2549">
          <g id="g2551" clip-path="url(#clipPath2555)">
            <g id="g2557" transform="translate(89.998,462.001)">
              <path
                d="m 0,0 h 69.999 c 0,22.092 17.909,40.001 40.001,40.001 22.093,0 40.002,-17.909 40.002,-40.001 H 220 c 5.501,0 10,-4.501 10,-10 v -39.999 c 0,-5.5 -4.5,-10 -10,-10 H 0 c -5.5,0 -10,4.5 -10,10 V -10 c 0,5.5 4.5,10 10,10 z"
                style={styleObject}
                id="path2559"
              />
            </g>
            <g id="g2561" transform="translate(322.0986,452.002)">
              <path
                d="m 0,0 h 47.899 c 11,0 20,-9.001 20,-20 v -402.002 c 0,-10.999 -9,-19.999 -20,-19.999 h -340 c -11,0 -20,8.999 -20,19.999 V -20 c 0,11 9,20 20,20 h 48.201"
                style={styleObject}
                id="path2563"
              />
            </g>
            <g id="g2565" transform="translate(154.9951,50.001)">
              <path
                d="m 0,0 h -104.996 v 362.001 h 28.199 m 243.901,0 h 27.899 L 195.003,0 H 90"
                style={styleObject}
                id="path2567"
              />
            </g>
            <g id="g2569" transform="translate(199.9941,462.001)">
              <path d="M 0,0 H 0.008" style={styleObject} id="path2571" />
            </g>
            <g id="g2573" transform="translate(430.999,398.667)">
              <path
                d="M 0,0 H 30 L 0,-40 h 30"
                style={styleObject}
                id="path2575"
              />
            </g>
            <g id="g2577" transform="translate(462,502.002)">
              <path
                d="M 0,0 H 40 L 0,-53.333 h 40"
                style={styleObject}
                id="path2579"
              />
            </g>
            <g id="g2581" transform="translate(115.7178,264.625)">
              <path
                d="m 0,0 c 5.593,-5.593 13.178,-8.735 21.087,-8.735 7.91,0 15.495,3.142 21.088,8.735"
                style={styleObject}
                id="path2583"
              />
            </g>
            <g id="g2585" transform="translate(242.1045,264.625)">
              <path
                d="m 0,0 c 5.593,-5.593 13.179,-8.735 21.088,-8.735 7.909,0 15.495,3.142 21.088,8.735"
                style={styleObject}
                id="path2587"
              />
            </g>
            <g id="g2589" transform="translate(185.874,197.3779)">
              <path d="M 0,0 H 28.249" style={styleObject} id="path2591" />
            </g>
            <g id="g2593" transform="translate(199.9912,50.001)">
              <path d="M 0,0 H 0.008" style={styleObject} id="path2595" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default NoListIcon;