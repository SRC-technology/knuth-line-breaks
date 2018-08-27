import { load } from 'opentype.js'

const commandToD = x => {
  switch (x.type) {
    case 'M':
      return `M${x.x},${x.y}`

    case 'L':
      return `L${x.x},${x.y}`

    case 'Q':
      return `Q${x.x},${x.y} ${x.x1},${x.y1}`

    case 'Z':
      return 'Z'

    default:
      return ''
  }
}



load('static/fonts/Lato2OFL/Lato-Regular.ttf', function(err, font) {
    if (err) {
        alert('Could not load font: ' + err);
    } else {
        console.log(font)
        global.font = font
        global.glyphs = font.glyphs.glyphs
        global.commandToD = commandToD
        if (global.document) {
          const context2d = global.document.querySelector('canvas')
          .getContext('2d')
          global.context2d = context2d

          const l = 'a'.repeat(3500).split('')
          console.log(l)
          l.forEach((_, i) => {
            global.glyphs[i].draw(context2d, 40 + 40 * (i % 20), 40 + (Math.floor(i / 20) * 40), 30)
          })
        }
    }
});

export default () => <div>
  <canvas
    width={1000}
    height={10000}
    style={{
      width: 500,
      height: 5000,
    }}
  />
</div>
