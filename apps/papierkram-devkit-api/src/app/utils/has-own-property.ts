export function hasOwnProperty<X, Y extends PropertyKey>(
  candidate: X,
  propertyKey: Y
): candidate is X & Record<Y, unknown> {
  if (typeof candidate !== 'object') {
    return false
  }

  return Object.prototype.hasOwnProperty.call(candidate, propertyKey)
}
