import { map, add, prop, init, head, range, last, tail } from 'ramda'
import elements from '../data/elements'

const glueExample = {
  type: 'G',
  width: 10,
  stretchability: 5,
  shrinkability: 2,
}
const penaltyExample = { type: 'P', width: 7, penalty: 10, flagged: false }

const _measureWidth = (elements, widths) => {
  if (elements.length === 0) {
    return widths
  }

  const [element, ...rest] = elements

  switch (element.type) {
    case 'P':
      return _measureWidth(
        rest,
        widths
      )

    case 'B':
      return _measureWidth(
        rest,
        map(x => x + element.width, widths)
      )

    case 'G':
      return _measureWidth(
        rest,
        {
          width: widths.width + element.width,
          minWidth: widths.minWidth + (element.width - element.shrinkability),
          maxWidth: widths.maxWidth + (element.width + element.stretchability),
        }
      )
  }
}

const measureWidth = (elements) =>
  _measureWidth(elements, {width: 0, minWidth: 0, maxWidth: 0})

const breakWordsIntoLines = (
  elements,
  desiredLineWidth,
  lines,
) => {
  if (elements.length === 0) {
    return lines
  }

  const currentElement = elements[0]

  switch (currentElement.type) {
    case 'B': {
      const tentativeNextCumulatedWidth = measureWidth(
        [...last(lines), currentElement]
      )

      const canBreak =
        desiredLineWidth > tentativeNextCumulatedWidth.minWidth &&
        desiredLineWidth < tentativeNextCumulatedWidth.maxWidth

      const isTooShort = tentativeNextCumulatedWidth.width < desiredLineWidth

      const factor = (
          desiredLineWidth -
          tentativeNextCumulatedWidth.width
        ) / isTooShort
          ? (
            tentativeNextCumulatedWidth.maxWidth -
            tentativeNextCumulatedWidth.width
          )
          : (
            tentativeNextCumulatedWidth.width -
            tentativeNextCumulatedWidth.minWidth
          )

      console.log('------------')
      console.log('currentElement', currentElement)
      console.log('currentElement.width', currentElement.width)
      console.log('tentativeNextCumulatedWidth', tentativeNextCumulatedWidth)
      console.log('canBreak', canBreak)
      if (canBreak) {
        console.log('factor', factor)
      }
      console.log('desiredLineWidth', desiredLineWidth)
      console.log('lines', lines)

      const nextLines =
        canBreak
          ? [
            ...lines.slice(0, -1),
            last(last(lines)).type === 'G'
              ? last(lines).slice(0, -1)
              : last(lines),
            [currentElement]
          ]
          : [
            ...lines.slice(0, -1),
            [
              ...lines[lines.length - 1],
              currentElement
            ]
          ]

      return breakWordsIntoLines(
        elements.slice(1),
        desiredLineWidth,
        nextLines,
      )
    }

    case 'G': {
      return breakWordsIntoLines(
        tail(elements),
        desiredLineWidth,
        [
          ...init(lines),
          [
            ...last(lines),
            currentElement
          ]
        ],
      )
    }

    case 'P':
      return breakWordsIntoLines(
        tail(elements),
        desiredLineWidth,
        lines
      )
  }
}

// const elementCandidates = range(0, 200)
//   .map(() => Math.random())
//   .map(value => 7 + Math.floor(value * 30))
//   .map(value => ({
//     type: 'B',
//     width: value,
//   }))
//   .map(box => Math.random() < 0.3
//     ? [box, penaltyExample]
//     : [box, glueExample]
//   )
//   .reduce((a, b) => a.concat(b), [])
//
// global.elementCandidates = elementCandidates

// const elements = [
//   { type: 'B', width: 18, },
//   glueExample,
//   { type: 'B', width: 15, },
//   glueExample,
//   { type: 'B', width: 35, },
//   glueExample,
//   { type: 'B', width: 25, },
//   glueExample,
//   { type: 'B', width: 7, },
//   glueExample,
//   { type: 'B', width: 16, },
//   penaltyExample,
//   { type: 'B', width: 36, },
//   glueExample,
//   { type: 'B', width: 16, },
//   glueExample,
//   { type: 'B', width: 10, },
//   penaltyExample,
//   { type: 'B', width: 20, },
//   glueExample,
//   { type: 'B', width: 36, },
//   glueExample,
//   { type: 'B', width: 13, },
//   glueExample,
//   { type: 'B', width: 43, },
//   glueExample,
//   { type: 'B', width: 32, },
// ]

const renderElement = (element, index) => {
  switch (element.type) {
    case 'B':
      return <span
        key={index}
        style={{
          backgroundColor: 'red',
          width: element.width,
          height: 20,
          display: 'inline-block',
        }}
      />

    case 'G':
      return <span
        key={index}
        style={{
          backgroundColor: 'blue',
          width: element.width,
          height: 20,
          display: 'inline-block',
        }}
      />

    default:
      return <span key={index} b/>
  }
}

export default () => <div
  style={{
    backgroundColor: 'beige',
    width: 300,
    overflow: 'scroll',
  }}>
  <div
    style={{
      width: 50000,
    }}>
    {breakWordsIntoLines(elements, 300, [[]])
      .map((line, index) => <div key={index}>
        {line.map(renderElement)}
      </div>)}
  </div>
</div>
