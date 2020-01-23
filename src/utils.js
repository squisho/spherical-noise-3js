import LogScale from 'log-scale'

//some helper functions here
export function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal)
}

export function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal)
  var delta = outMax - outMin
  return outMin + fr * delta
}

export function avg(arr) {
  var total = arr.reduce(function(sum, b) {
    return sum + b
  })
  return total / arr.length
}

export function max(arr) {
  return arr.reduce(function(a, b) {
    return Math.max(a, b)
  })
}

export const noNaN = (number, dflt = 0) => (isNaN(number) ? dflt : number)

export const nodulate = (n, iMin, iMax, oMin, oMax, dflt) => noNaN(modulate(n, iMin, iMax, oMin, oMax), dflt)

export const h2x = c => c.replace('#', '0x')

export const x2h = c => c.replace('0x', '#')

export const updateColor = (obj, c, rgb) => {
  const  isArray = Array.isArray(c)
  if (rgb && isArray) obj.color.setRGB(...c)
  else if (isArray) obj.color.setHSL(...c)
  else if (typeof c === 'string') obj.color.setHex(h2x(c))
  else obj.color.set(c)
}


const logScales = {}

export const logMap = (val, inMin, inMax, outMin, outMax) => { 
  const logKey = `${inMin}-${inMax}`
  
  let logScale = logScales[logKey]
  if (!logScale) {
    logScale = new LogScale(inMin, inMax)
    logScales[logKey] = logScale
  }

  const lin =  logScale.logarithmicToLinear(val)
  return modulate(lin, 0, 1, outMin, outMax)
}

export const tanhMap = (val, inMin, inMax, outMin, outMax) => {
  const fInMin = -20, fInMax = 20
  const fOutMin = -1, fOutMax = 1

  // map the input from the in range to the functions domain
  const x = modulate(val, inMin, inMax, fInMin, fInMax)

  const y = Math.tanh(x)

  // map the function's output to the desired range
  const output = modulate(y, fOutMin, fOutMax, outMin, outMax)

  return output
}
