function extractPCM4AudioBuffer(ab: AudioBuffer): Float32Array[] {
  return Array(ab.numberOfChannels)
    .fill(0)
    .map((_, i) => ab.getChannelData(i));
}

export default async function resampleAudio(
  pcmData: Float32Array[],
  curRate: number,
  targetRate: number
): Promise<Float32Array[]> {
  const channelCount = pcmData.length;
  const emptyPCM = Array(2)
    .fill(0)
    .map(() => new Float32Array(0));

  if (channelCount === 0) {
    return emptyPCM;
  }

  const len = Math.max(...pcmData.map((pcm) => pcm.length));

  if (len === 0) {
    return emptyPCM;
  }

  const ctx = new OfflineAudioContext(
    channelCount,
    (len * targetRate) / curRate,
    targetRate
  );

  const abSource = ctx.createBufferSource();

  const ab = ctx.createBuffer(channelCount, len, curRate);

  pcmData.forEach((data, index) => ab.copyToChannel(data, index));

  abSource.buffer = ab;
  abSource.connect(ctx.destination);

  abSource.start();

  return extractPCM4AudioBuffer(await ctx.startRendering());
}
