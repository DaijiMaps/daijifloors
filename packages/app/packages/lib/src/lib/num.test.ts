import { split } from './num'
import { expect, test } from 'vitest'

test('split 12.34', () => {
  const res = split(12.34)
  expect(res).toEqual([12, expect.closeTo(0.34, 5)])
})
