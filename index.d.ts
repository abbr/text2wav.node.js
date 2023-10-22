declare interface Options {
    voice?: string,
    amplitude?: number,
    wordGap?: number,
    capital?: number,
    lineLength?: number,
    pitch?: number,
    speed?: number,
    encoding?: number,
    hasTags?: boolean,
    noFinalPause?: boolean,
    punct?: string,
}

interface text2wav {
    (text: string, opts?: Options): Promise<Uint8Array>
}
declare const instance: text2wav
export = instance
