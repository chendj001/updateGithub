export const sleep = async (timer: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(timer)
    }, timer)
  })
}
