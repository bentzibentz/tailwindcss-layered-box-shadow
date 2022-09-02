const plugin = require('tailwindcss/plugin')

/*
* Convert hex to hsl
 */
/**
 * ECMA2016 / ES6
 */
const convertHexToRGBA = (hexCode, opacity) => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;
    }

    return `${r},${g},${b},${opacity}`;
};

const layeredBoxShadow = plugin(
  function ({ matchUtilities, addUtilities, theme, e }) {
    const shadowColor = theme('shadowColor');
    const shadowTint = theme('shadowTint');
    const shadowSize = theme('shadowSize');
    const shadowPositionX = theme('shadowPositionX');
    const shadowPositionY = theme('shadowPositionY');
    const shadowBlur = theme('shadowBlur');
    const shadowSpread = theme('shadowSpread');

      const color = convertHexToRGBA(shadowColor, shadowTint ? shadowTint : 1);

    const layers = [
        { size: 'xs', layers: 3},
        { size: 'sm', layers: 4},
        { size: 'md', layers: 5},
        { size: 'lg', layers: 6},
        { size: 'xl', layers: 7},
        { size: '2xl', layers: 8}
    ];

    const generateShadows = () => {
        let shadows = [];
        layers.forEach((el) => {
            console.log(el);
            const layers = Array(el.layers).fill(0);
            console.log(layers);
            let shadowValueStr = '';
            let blur = 0;
            let spread = shadowSpread;
            layers.forEach((el, idx) => {
                if (blur === 0) {
                    blur = shadowBlur;
                }
                shadowValueStr = shadowValueStr + ' ' + `${shadowPositionX * (idx + 2)}px ${shadowPositionY * (idx + 2)}px ${blur}px  ${spread}px rgba(${color}),`;
                spread = spread - 0.375;
            })

            shadowValueStr = shadowValueStr.slice(0, -1);

            const shadow = { [el.size]: shadowValueStr };

            console.log(shadow);

            shadows.push(shadow);
        });

        return shadows;
    }

    const shadowArrs = generateShadows();
    console.log(shadowArrs);
    let shadowSizeDefaults = Object.assign({}, ...shadowArrs);

    console.log(shadowSizeDefaults);

    const shadows = shadowSizeDefaults;

    console.log(shadows);

      addUtilities(
      [
        Object.entries(shadows).map(([key, value]) => {
          return {
            [`.${e(`shadow-layered-${key}`)}`]: {
              'boxShadow': `${value}`,
            },
          }
        })
      ]
    )
  },
  {
    experimental: { matchVariant: true },
    theme: {
        shadowSize: {},
        shadowTint: 0.34,
        shadowColor: '#6267ad',
        shadowPositionX: 1,
        shadowPositionY: 1,
        shadowBlur: 10,
        shadowSpread: -0.2
    },
  }
)

module.exports = layeredBoxShadow;
