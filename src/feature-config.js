import { ansiRegex } from "ansi-colors";

const range = (min=0, max=1) => ({ min, max })

export default {
    features: [
        'rms',
        'zcr',
        'energy',
        'amplitudeSpectrum',
        'spectralCentroid',
        'spectralFlatness',
        'spectralSlope',
        'spectralRolloff',
        'spectralSpread',
        'spectralSkewness',
        'spectralKurtosis',
        'chroma',
        'loudness',
        'perceptualSpread',
        'perceptualSharpness',
        'mfcc'
    ],
    ranges: {
        // time-domain
        rms: range(),
        zcr: range(0, 255), // bufferSize / 2 - 1
        energy: range(0, 512),
        // loudness: range(0, 24),

        // spectral features
        spectralCentroid: range(0, 256), // bufferSize / 2
        spectralFlatness: range(),
        spectralFlux: range(0, 1000), // has no max!!
        spectralSlope: range(0, 1),
        spectralRolloff: range(0, 22050), // half sample rate
        spectralSpread: range(0, 256), // half fft size
        spectralSkewness: range(-100, 100), // no defined range
        // chroma: new Array(12).fill(null).map(() => range()),

        // perceptual spread
        loudness: {
            specific: new Array(24).fill(null).map(() => range()),
            total: range(0, 24),
        },
        perceptualSpread: range(0.0, 1.0),
        perceptualSharpness: range(0.0, 1.0),
        // mfcc: new Array(13).fill(null).map(() => range()),
    }
}
