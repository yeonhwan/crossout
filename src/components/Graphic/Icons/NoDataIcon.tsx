import { type CSSProperties } from "react";

type NodataIconProps = {
  className?: string;
  color?: string;
};

const NoDataIcon = ({ className, color }: NodataIconProps) => {
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
      id="svg171"
      xmlSpace="preserve"
      width="current"
      height="current"
      fill="current"
      viewBox="0 0 682.66669 682.66669"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs id="defs175">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath185">
          <path d="M 0,512 H 512 V 0 H 0 Z" id="path183" />
        </clipPath>
      </defs>
      <g id="g177" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)">
        <g id="g179">
          <g id="g181" clip-path="url(#clipPath185)">
            <g id="g187" transform="translate(421.6562,450.0005)">
              <path
                d="m 0,0 h 40.344 c 22.001,0 40,-18 40,-40 v -320 c 0,-22 -17.999,-40 -40,-40 H -134.8 l -19.149,-33.169 c -5.002,-8.932 -18.046,-9.231 -23.301,-0.158 L -196.492,-400 h -175.165 c -22.001,0 -40,18 -40,40 v 320 c 0,22 17.999,40 40,40 h 283.615"
                style={styleObject}
                className={color}
                id="path189"
              />
            </g>
            <g id="g191" transform="translate(377.541,502.001)">
              <path
                d="m 0,0 c -10.449,0 -44.458,-37.974 -44.458,-67.191 0,-24.193 20.091,-44.904 44.458,-44.811 24.368,-0.093 44.458,20.618 44.458,44.811 C 44.458,-37.974 10.449,0 0,0 Z"
                style={styleObject}
                id="path193"
              />
            </g>
            <g id="g195" transform="translate(222.3237,207.5723)">
              <path
                d="M 0,0 C 8.931,8.931 21.045,13.949 33.676,13.949 46.307,13.949 58.42,8.931 67.352,0"
                style={styleObject}
                id="path197"
              />
            </g>
            <g id="g199" transform="translate(200.999,295.7495)">
              <path d="M 0,0 -30,-30" style={styleObject} id="path201" />
            </g>
            <g id="g203" transform="translate(170.9995,295.7495)">
              <path d="M 0,0 30,-30" style={styleObject} id="path205" />
            </g>
            <g id="g207" transform="translate(341,295.7495)">
              <path d="M 0,0 -30,-30" style={styleObject} id="path209" />
            </g>
            <g id="g211" transform="translate(311,295.7495)">
              <path d="M 0,0 30,-30" style={styleObject} id="path213" />
            </g>
            <g id="g215" transform="translate(210.9966,90.0005)">
              <path
                d="m 0,0 h -160.998 v 320 h 288.835 m 77.603,0 h 45.563 V 0 H 90"
                style={styleObject}
                id="path217"
              />
            </g>
            <g id="g219" transform="translate(255.9927,90.0005)">
              <path d="M 0,0 H 0.007" style={styleObject} id="path221" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default NoDataIcon;
