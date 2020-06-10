// Случайное целое число от min до max
function random (min: number, max: number): number {
  const rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

export default random
