export function ToImageCdnUri(uri: string, width: number, height: number) {
  return {
    uri: `https://floimages.mncdn.com/mncropresize/${width}/${height}/${uri}`,
  };
}
