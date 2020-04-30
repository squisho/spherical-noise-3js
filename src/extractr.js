import Meyda from 'meyda'

import { avg, max } from './utils'

export default class Extractr {
  constructor(features, alphas={}) {
    this.features = features
    this.avgs = features.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
    this.alphas = features.reduce((acc, cur, i) => ({ ...acc, [cur]: alphas[cur] || 0.95 }), {})
  }

  setup = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    }).catch((err) => {
      alert('Need Microphone to react to ambient sound')
    })
    

  

    const audioContext = new AudioContext()
    // set audio source to input stream from microphone
    // (Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
    const source = audioContext.createMediaStreamSource(stream)

    this.analyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 2048, // >= 1024 seems to stop ball from disappearing randomly
      featureExtractors: this.features,
      callback: () => null,
    })
    console.log(this.features)

    this.analyzer.start()
    return this.analyzer
  }

  getAvg = (feature) => {
    let curr = this.analyzer.get(feature)
    if (feature === 'loudness') curr = curr.total

    const a = this.alphas[feature]
    const prev = this.avgs[feature]

    this.avgs[feature] = prev * a + (1 - a) * curr
    
    return this.avgs[feature]
  }

  spectrumStats = () => {
    
    if (!this.analyzer) return null
    const soundData = this.analyzer.get('amplitudeSpectrum')
    if (!soundData) return null

    const lowerHalfArray = soundData.slice(0, soundData.length / 2 - 1)
    const upperHalfArray = soundData.slice(soundData.length / 2, soundData.length - 1)

    const overallAvg = avg(soundData)
    const lowerMax = max(lowerHalfArray)
    const lowerAvg = avg(lowerHalfArray)
    const upperMax = max(upperHalfArray)
    const upperAvg = avg(upperHalfArray)

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
