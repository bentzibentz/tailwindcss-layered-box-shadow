const plugin = require('tailwindcss/plugin')

/*
* Convert hex to hsl
 */
const hexToHSL = (H) => {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return  h + "deg," + s + "%," + l + "%";
}

const layeredBoxShadow = plugin(
  function ({ matchUtilities, addUtilities, theme, e }) {
    const shadowColor = theme('shadowColor');
    const shadowTint = theme('shadowTint');
    const shadowSize = theme('shadowSize');

    const color = hexToHSL(shadowColor);

    let shadowSizeDefaults = {
        'low-r': `
            0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            1.4px 1.4px 2.2px -1.2px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            3.3px 3.3px 5.3px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
        `,
        'medium-r': `0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            2.7px 2.7px 4.3px -0.8px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            6.7px 6.8px 10.7px -1.7px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            16.3px 16.5px 26.1px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.36'});
        `,
        'high-r': `0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            4.8px 4.8px 7.6px -0.4px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            8.9px 9px 14.2px -0.7px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            14.6px 14.7px 23.3px -1.1px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            23.3px 23.5px 37.2px -1.4px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            36.4px 36.7px 58.2px -1.8px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            55.4px 55.9px 88.5px -2.1px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
            81.5px 82.3px 130.3px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
        `,
        'low-l': `-0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -1.3px 1.4px 2.1px -1.2px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -3.3px 3.3px 5.3px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
        `,
        'medium-l': `-0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            -2.7px 2.7px 4.3px -0.8px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            -6.7px 6.8px 10.7px -1.7px hsl(${color} / ${shadowTint ? shadowTint : '0.36'}),
            -16.3px 16.5px 26.1px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.36'});
        `,
        'high-l': `-0.8px 0.8px 1.3px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -4.7px 4.8px 7.6px -0.4px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -8.9px 9px 14.2px -0.7px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -14.6px 14.7px 23.3px -1.1px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -23.2px 23.5px 37.2px -1.4px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -36.3px 36.7px 58.1px -1.8px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -55.2px 55.9px 88.4px -2.1px hsl(${color} / ${shadowTint ? shadowTint : '0.34'}),
            -81.4px 82.3px 130.2px -2.5px hsl(${color} / ${shadowTint ? shadowTint : '0.34'});
        `,
    }

    let shadows;
    if (shadowSize) {
        shadows = Object.assign({}, shadowSize, shadowSizeDefaults);
    } else {
        shadows = shadowSizeDefaults;
    }

    console.log(shadows);

      addUtilities(
      [
        Object.entries(shadows).map(([key, value]) => {
          return {
            [`.${e(`layered-boxShadow-${key}`)}`]: {
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
        shadowTint: false,
        shadowColor: '#6267ad'
    },
  }
)

module.exports = layeredBoxShadow;
