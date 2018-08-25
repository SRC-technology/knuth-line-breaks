import { Component } from 'react'
import Head from 'next/head'
import text from '../data/alice-in-wonderland.js'

const CHARACTER_WIDTH = 10.8369140625
const LINE_WIDTH = 500

const getParagraphs = s => s.split('\n').filter(x => x.trim() !== '')

const words = t => t.split(/\s/).filter(x => x !== '')

const breakWordsIntoLines = (
  words,
  characterWidth,
  lineWidth,
  lines,
  cumulatedWidth,
) => {
  if (words.length === 0) {
    return lines
  }

  const currentWord = words[0]
  const currentWordWidth = currentWord.length * characterWidth
  const tentativeNextCumulatedWidth =
    cumulatedWidth +
    (cumulatedWidth !== 0 ? CHARACTER_WIDTH : 0) +
    currentWordWidth
  const hasWidthOverflown =
    tentativeNextCumulatedWidth > lineWidth

  console.log('------------')
  console.log('currentWord', currentWord)
  console.log('currentWordWidth', currentWordWidth)
  console.log('cumulatedWidth', cumulatedWidth)
  console.log('tentativeNextCumulatedWidth', tentativeNextCumulatedWidth)
  console.log('hasWidthOverflown', hasWidthOverflown)
  console.log('lineWidth', lineWidth)
  console.log('lines', lines)

  const nextLines =
    hasWidthOverflown
      ? [
        ...lines,
        currentWord
      ]
      : [
        ...lines.slice(0, -1),
        lines[lines.length - 1] + (lines[lines.length - 1] !== '' ? ' ' : '') + currentWord
      ]

  const nextCumulatedWidth =
    hasWidthOverflown
      ? currentWordWidth
      : tentativeNextCumulatedWidth

  return breakWordsIntoLines(
    words.slice(1),
    characterWidth,
    lineWidth,
    nextLines,
    nextCumulatedWidth
  )
}

const breakParagraphIntoLines = (text, characterWidth, lineWidth) =>
  breakWordsIntoLines(
    words(text),
    characterWidth,
    lineWidth,
    [''],
    0,
  )

const NormalizedP = ({children}) => <p
  style={{
    lineHeight: '30px',
    marginTop: 0,
    marginBottom: 30,
  }}>
  {children}
</p>

const Side = ({children, isLeft}) => <section
  style={{
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    fontSize: 18,
    fontFamily: 'Menlo',
    margin: '0 auto',
    backgroundColor: isLeft ? '#f0f0f0' : '#ffffff',
    alignItems: 'center',
  }}>
  {children}
</section>

class DrawnParagraph extends Component {
  constructor () {
    super()

    this.handleRef = this.handleRef.bind(this)
  }

  handleRef (ref) {
    if (ref) {
      this.ref = ref
      this.context2d = ref.getContext('2d')
      this.context2d.font = '36px Menlo'
      const linesToPaint = this.props.children
        .slice(0, 1)
        .map(line => breakParagraphIntoLines(
          line,
          CHARACTER_WIDTH,
          LINE_WIDTH
        ))
        .reduce((a, b) => a.concat(b), [])
        .map((line, index) => ({
          text: line,
          y: 42 + (60 * index)
        }))


      linesToPaint.forEach(
        ({text, y}) => {
          this.context2d
            .fillText(text, 0, y)
        }
      )

      console.log(
        breakParagraphIntoLines(
          this.props.children[0],
          CHARACTER_WIDTH,
          LINE_WIDTH
        )
      )

      const characterWidth = this.context2d.measureText('AAAA').width
      console.log(characterWidth, characterWidth / 2)
      // 10.8369140625

      global.context2d = this.context2d
    }
  }

  render () {
    return <canvas
      ref={this.handleRef}
      width={1000}
      height={1000}
      style={{
        width: 500,
        height: 500
      }}
    />
  }
}


export default () => <main
  style={{
    color: '#343434',
    display: 'flex',
    flexDirection: 'row',
  }}>
  <Head>
    <style>
      {`body { margin: 0 }`}
    </style>
  </Head>
  <Side isLeft>
    <article
      style={{
        width: 500,
      }}>
      {getParagraphs(text).map((s, i) => <NormalizedP key={i}>{s}</NormalizedP>)}
    </article>
  </Side>
  <Side>
    <article
      style={{
        width: 500,
        height: 500,
      }}>
      <DrawnParagraph>
        {getParagraphs(text)}
      </DrawnParagraph>
    </article>
  </Side>
</main>
