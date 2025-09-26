import * as React from "react"

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={it} className={idx === items.length - 1 ? "font-medium" : ""}>
            {it}
            {idx < items.length - 1 ? <span className="mx-2">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
