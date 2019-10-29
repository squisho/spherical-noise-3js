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