// The navigator object contains information about the browser.
// this async call initializes audio input from the user
// navigator.mediaDevices.enumerateDevices().then(devices => {
//   const device = devices[6] // sound card output
//   navigator.mediaDevices.getUserMedia({ audio: device, video: false }).then(stream => {
//     if (!analyzer) initAnalyzer(stream)
//   })
// })

const setupAnalyzer = featureExtractors => navigator.mediaDevices.getUserMedia({ 
    audio: true, video: false 
}).then(stream => {
  const audioContext = new AudioContext()
  // set audio source to input stream from microphone 
  // (Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)
  const source = audioContext.createMediaStreamSource(stream)

  const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: 256,
    featureExtractors,
    callback: features => null
  })

  analyzer.start()
  return analyzer
})