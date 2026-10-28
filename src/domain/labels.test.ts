import { describe, expect, it } from 'vitest'
import {
  boardRefreshLabel,
  formatAge,
  formatBoston,
  formatSince,
  formatUpdatedAgo,
} from './labels.ts'

describe('formatBoston', () => {
  it('shows the Boston clock down to the second', () => {
    expect(formatBoston('2026-10-28T04:13:45Z')).toBe('28 Okt 2026, 00.13.45')
  })
})

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

describe('formatUpdatedAgo', () => {
  const now = Date.parse('2026-10-28T12:00:00Z')

  it('counts seconds, then minutes with the leftover seconds', () => {
    expect(formatUpdatedAgo('2026-10-28T11:59:48Z', now)).toBe(
      'Diperbarui 12 detik yang lalu',
    )
    expect(formatUpdatedAgo('2026-10-28T11:58:40Z', now)).toBe(
      'Diperbarui 1 menit 20 detik yang lalu',
    )
  })

  it('uses hours once the report is at least an hour old', () => {
    expect(formatUpdatedAgo('2026-10-28T09:55:10Z', now)).toBe(
      'Diperbarui 2 jam 4 menit yang lalu',
    )
  })

  it('says when the vehicle has no update time', () => {
    expect(formatUpdatedAgo(null, now)).toBe('Diperbarui tidak ada waktu')
  })

  it('states the board age without the card prefix', () => {
    expect(formatSince(now - 8_000, now)).toBe('8 detik yang lalu')
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
