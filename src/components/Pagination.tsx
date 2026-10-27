import { PAGE_SIZES, type PageSize } from '../domain/types.ts'

type Props = {
  page: number
  pageSize: PageSize
  offset: number
  countOnPage: number
  total: number | null
  totalLoading: boolean
  totalError: boolean
  onRetryTotal: () => void
  hasNext: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

function pageWindow(page: number, pages: number): number[] {
  const start = Math.max(1, page - 2)
  const end = Math.min(pages, start + 4)
  const first = Math.max(1, end - 4)
  const numbers: number[] = []
  for (let number = first; number <= end; number += 1) numbers.push(number)
  return numbers
}

export function Pagination(props: Props) {
  const start = props.countOnPage === 0 ? 0 : props.offset + 1
  const end = props.offset + props.countOnPage
  const totalText = props.total == null ? '…' : String(props.total)
  const pages = props.total == null || props.total === 0 ? 0 : Math.ceil(props.total / props.pageSize)
  const numbers = pages > 0 ? pageWindow(props.page, pages) : []

  return (
    <div className="flex flex-col gap-4 border-t-4 border-bar pt-4">
      <p className="text-sm text-navy" aria-live="polite">
        Menampilkan {start}–{end} dari {totalText} data
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-navy">
          Data per halaman
          <select
            className="rounded border border-line bg-white px-2 py-1.5 text-navy"
            value={props.pageSize}
            onChange={(event) => props.onPageSizeChange(Number(event.target.value) as PageSize)}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted">
          {props.totalLoading
            ? 'Menghitung jumlah halaman…'
            : props.totalError
              ? 'Jumlah halaman gagal dimuat.'
              : pages === 0
                ? '0 halaman'
                : `Halaman ${props.page} dari ${pages}`}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded bg-bar px-3 py-2 text-sm text-white disabled:bg-line disabled:text-muted"
          onClick={() => props.onPageChange(props.page - 1)}
          disabled={props.page <= 1}
        >
          Sebelumnya
        </button>
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            className={`min-w-10 rounded px-3 py-2 text-sm ${
              number === props.page ? 'bg-navy text-white' : 'bg-field text-navy'
            }`}
            onClick={() => props.onPageChange(number)}
            aria-current={number === props.page ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          className="rounded bg-bar px-3 py-2 text-sm text-white disabled:bg-line disabled:text-muted"
          onClick={() => props.onPageChange(props.page + 1)}
          disabled={!props.hasNext && (pages === 0 || props.page >= pages)}
        >
          Berikutnya
        </button>
        {props.totalError ? (
          <button type="button" className="text-sm font-bold text-navy underline" onClick={props.onRetryTotal}>
            Coba lagi
          </button>
        ) : null}
      </div>
    </div>
  )
}
