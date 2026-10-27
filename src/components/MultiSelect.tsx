import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export type SelectOption = {
  id: string
  label: string
  description?: string
  color?: string
  textColor?: string
}

type Props = {
  label: string
  placeholder: string
  options: SelectOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  disabledReason?: string
  loading: boolean
  error: boolean
  onRetry: () => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  onOpenChange?: (open: boolean) => void
  emptyLabel: string
  errorLabel: string
}

export function MultiSelect(props: Props) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const sentinelRef = useRef<HTMLLIElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const onLoadMoreRef = useRef(props.onLoadMore)
  const onOpenChangeRef = useRef(props.onOpenChange)

  useEffect(() => {
    onLoadMoreRef.current = props.onLoadMore
    onOpenChangeRef.current = props.onOpenChange
  }, [props.onLoadMore, props.onOpenChange])

  const filtered = props.options.filter((option) => {
    const haystack = `${option.label} ${option.description ?? ''}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  function setOpenState(next: boolean) {
    setOpen(next)
    onOpenChangeRef.current?.(next)
    if (!next) {
      setQuery('')
      setActiveIndex(0)
    }
  }

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
        setActiveIndex(0)
        onOpenChangeRef.current?.(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !props.hasMore) return
    const sentinel = sentinelRef.current
    const root = listRef.current
    if (!sentinel || !root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMoreRef.current()
      },
      { root, rootMargin: '48px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [open, props.hasMore, props.loadingMore, props.options.length])

  const activeId = filtered[activeIndex]?.id
  useEffect(() => {
    if (!open || !activeId) return
    document.getElementById(`${listId}-${activeId}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, activeId, listId])

  function toggleId(id: string) {
    if (props.selectedIds.includes(id)) {
      props.onChange(props.selectedIds.filter((selected) => selected !== id))
      return
    }
    props.onChange([...props.selectedIds, id])
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpenState(false)
      return
    }
    if (filtered.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(filtered.length - 1, index + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(0, index - 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(filtered.length - 1)
    } else if (
      event.key === 'Enter' ||
      (event.key === ' ' && event.target !== searchRef.current)
    ) {
      event.preventDefault()
      const option = filtered[activeIndex]
      if (option) toggleId(option.id)
    }
  }

  const selectedLabels = props.selectedIds.map(
    (id) => props.options.find((option) => option.id === id)?.label ?? id,
  )
  const summary =
    selectedLabels.length === 0
      ? props.placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`
  const active = filtered[activeIndex]

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1" onKeyDown={onKeyDown}>
      <span className="mb-1 block text-sm font-bold text-navy">{props.label}</span>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded border border-line bg-white px-3 py-2 text-left text-navy disabled:bg-field disabled:text-muted"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={props.disabled}
        onClick={() => setOpenState(!open)}
      >
        <span className="truncate">
          {props.disabled ? props.disabledReason : summary}
        </span>
        <span aria-hidden="true" className="text-bar">
          ▾
        </span>
      </button>
      {props.disabled ? (
        <p className="mt-1 text-xs text-muted">{props.disabledReason}</p>
      ) : null}
      {open ? (
        <div className="absolute z-30 mt-1 w-full min-w-64 rounded border border-line bg-white shadow-[0_5px_6px_rgba(0,0,0,0.25)]">
          <div className="border-b border-line p-2">
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              className="w-full rounded border border-line px-2 py-1.5 text-sm text-navy"
              placeholder="Cari di daftar"
              aria-label={`Cari ${props.label}`}
              aria-activedescendant={active ? `${listId}-${active.id}` : undefined}
              aria-controls={listId}
            />
          </div>
          {props.loading ? <p className="px-3 py-2 text-sm">Memuat…</p> : null}
          {props.error ? (
            <div
              className="flex items-center justify-between gap-2 px-3 py-2"
              role="alert"
            >
              <p className="text-sm">{props.errorLabel}</p>
              <button
                type="button"
                className="text-sm font-bold text-navy underline"
                onClick={props.onRetry}
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            className="max-h-72 overflow-y-auto"
          >
            {!props.loading && !props.error && filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">{props.emptyLabel}</li>
            ) : null}
            {filtered.map((option, index) => {
              const selected = props.selectedIds.includes(option.id)
              return (
                <li
                  key={option.id}
                  id={`${listId}-${option.id}`}
                  role="option"
                  aria-selected={selected}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${
                    index === activeIndex ? 'bg-panel' : 'bg-white'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => toggleId(option.id)}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${
                      selected ? 'border-bar bg-bar text-white' : 'border-line bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {selected ? '✓' : ''}
                  </span>
                  {option.color ? (
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: option.color,
                        color: option.textColor ?? '#fff',
                      }}
                    >
                      {option.label.slice(0, 3)}
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{option.label}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </li>
              )
            })}
            <li ref={sentinelRef} className="px-3 py-2 text-center text-xs text-muted">
              {props.loadingMore
                ? 'Memuat lagi…'
                : props.hasMore
                  ? 'Gulir untuk memuat lagi'
                  : ''}
            </li>
          </ul>
          {props.selectedIds.length > 0 ? (
            <div className="border-t border-line p-2">
              <button
                type="button"
                className="text-sm font-bold text-navy"
                onClick={() => props.onChange([])}
              >
                Hapus pilihan
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
