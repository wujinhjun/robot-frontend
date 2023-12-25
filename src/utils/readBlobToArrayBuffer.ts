export function readBlobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export function readBlobToFloat32(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const dataView = new DataView(arrayBuffer);
      const result = new Float32Array(arrayBuffer.byteLength / 4);

      for (let i = 0; i < result.length; i++) {
        const offset = i * 4;

        result[i] = dataView.getFloat32(offset, true);
      }

      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
