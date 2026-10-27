import { describe, expect, it } from 'vitest'
import { boardRefreshLabel, formatAge } from './labels.ts'

describe('formatAge', () => {
  const now = 60_000

  it('says a fetch from the last few seconds just happened', () => {
    expect(formatAge(now - 1_000, now)).toBe('baru saja')
  })

  it('counts whole seconds, minutes, and hours', () => {
    expect(formatAge(now - 12_000, now)).toBe('12 detik lalu')
    expect(formatAge(now - 120_000, now)).toBe('2 menit lalu')
    expect(formatAge(now - 7_200_000, now)).toBe('2 jam lalu')
  })
})

describe('boardRefreshLabel', () => {
  it('keeps the last cards visible when a later refresh fails', () => {
    expect(
      boardRefreshLabel({ updatedAt: 1_000, now: 20_000, fetching: false, failed: true }),
    ).toContain('gagal memperbarui')
  })

  it('says the board is updating without calling the data paused', () => {
    const label = boardRefreshLabel({
      updatedAt: 1_000,
      now: 8_000,
      fetching: true,
      failed: false,
    })

    expect(label).toContain('memperbarui')
    expect(label).not.toContain('dijeda')
  })
})
