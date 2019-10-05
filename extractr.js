// The navigator object contains information about the browser.
// this async call initializes audio input from the user
// navigator.mediaDevices.enumerateDevices().then(devices => {
//   const device = devices[6] // sound card output
//   navigator.mediaDevices.getUserMedia({ audio: device, video: false }).then(stream => {
//     if (!analyzer) initAnalyzer(stream)
//   })
// })

class Extractr {
  constructor(features, alphas) {
    this.features = features 
    this.avgs = features.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
    this.alphas = features.reduce((acc, cur, i) => ({ ...acc, [cur]: alphas ? alphas[i] : 0.7 }), {})
  }

  setup = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, video: false 
    })
    
    const audioContext = new AudioContext()
    // set audio source to input stream from microphone 
    // (Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
    const source = audioContext.createMediaStreamSource(stream)

    this.analyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 256,
      featureExtractors: this.features,
      callback: () => null
    })

    this.analyzer.start()
    return this.analyzer
  }

  getAvg = feature => {
    const curr = this.analyzer.get(feature)
    const a = this.alphas[feature]
    const prev = this.avgs[feature]

    this.avgs[feature] = prev * a + (1 - a) * curr

    return this.avgs[feature]
  }

  spectrumStats = () => {
    const soundData = this.analyzer.get('amplitudeSpectrum')
    if (!soundData) return null

    const lowerHalfArray = soundData.slice(0, soundData.length / 2 - 1)
    const upperHalfArray = soundData.slice(soundData.length / 2, soundData.length - 1)

    const overallAvg  = avg(soundData)
    const lowerMax    = max(lowerHalfArray)
    const lowerAvg    = avg(lowerHalfArray)
    const upperMax    = max(upperHalfArray)
    const upperAvg    = avg(upperHalfArray)

    const lowerMaxFr = lowerMax / lowerHalfArray.length
    const lowerAvgFr = lowerAvg / lowerHalfArray.length
    const upperMaxFr = upperMax / upperHalfArray.length
    const upperAvgFr = upperAvg / upperHalfArray.length

    return {
      avg: overallAvg,
      lower: { avg: lowerAvg, avgFr: lowerAvgFr, max: lowerMax, maxFr: lowerMaxFr },
      upper: { avg: upperAvg, avgFr: upperAvgFr, max: upperMax, maxFr: upperMaxFr },
    }
  }
}