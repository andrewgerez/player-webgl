export function delay(ms: number, callback: () => void): Promise<number> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      callback()

      if (ms <= 0) {
        clearInterval(interval)
        resolve(ms)
      }

      ms -= 1000
    }, 1000)
  })
}

export function secondsToMsSs(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(14, 19)
}
