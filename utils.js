//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal)
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal)
  var delta = outMax - outMin
  return outMin + fr * delta
}

function avg(arr) {
  var total = arr.reduce(function(sum, b) {
    return sum + b
  })
  return total / arr.length
}

function max(arr) {
  return arr.reduce(function(a, b) {
    return Math.max(a, b)
  })
}

const noNaN = (number, dflt = 0) => (isNaN(number) ? dflt : number)

const nodulate = (n, iMin, iMax, oMin, oMax, dflt) => noNaN(modulate(n, iMin, iMax, oMin, oMax), dflt)

const h2x = c => c.replace('#', '0x')

const x2h = c => c.replace('0x', '#')

const updateColor = (obj, c, rgb) => {
  const  isArray = Array.isArray(c)
  if (rgb && isArray) obj.color.setRGB(...c)
  else if (isArray) obj.color.setHSL(...c)
  else if (typeof c === 'string') obj.color.setHex(h2x(c))
  else obj.color.set(c)
}