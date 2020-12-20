import { IIndexedBuild } from "../types"

function calcRatio(width: number, height: number): number {
  const ratio = height / width

  if (isNaN(ratio)) {
    return 1
  }

  return ratio
}

function columnHeight(
  items: IIndexedBuild[],
  colWidth: number,
  gutter: number
): number {
  const gutterHeight = Math.max(items.length - 1, 0) * gutter
  const itemsTotalHeight = items.reduce((acc, item) => {
    return acc + calcRatio(item.image.width, item.image.height) * colWidth
  }, 0)

  return itemsTotalHeight + gutterHeight
}

function getShortestColumn(
  columns: IIndexedBuild[][],
  colWidth: number,
  gutter: number
) {
  const currColumnsHeight = columns.map((column) =>
    columnHeight(column, colWidth, gutter)
  )
  const min = Math.min(...currColumnsHeight)
  const shortestColumnIndex = currColumnsHeight.indexOf(min)

  return columns[shortestColumnIndex]
}

export function useDistributeToColumn(
  items: IIndexedBuild[],
  colCount: number,
  containerWidth: number,
  gutter: number
): IIndexedBuild[][] {
  if (colCount === 0) {
    return []
  }

  const colWidth =
    containerWidth / colCount - (gutter * (colCount - 1)) / colCount

  const columns = Array.from({ length: colCount }, () => [] as IIndexedBuild[])

  // TODO: memoize
  items.forEach((item) => {
    const shortestColumn = getShortestColumn(columns, colWidth, gutter)

    shortestColumn.push(item)
  })

  return columns
}
