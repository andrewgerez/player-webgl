export function getDimensions() {
  const width = window.innerWidth
  const height = window.innerHeight
  const aspectRatio = width / height

  return { width, height, aspectRatio }
}

export function getTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6
}
