import { Fragment, HTMLProps } from 'react'

export interface FloorCategoriesProps {
  _categories?: string[]
}

export function FloorCategories(
  props: FloorCategoriesProps & HTMLProps<HTMLParagraphElement>
) {
  const { _categories, ...rest } = props

  return _categories === undefined || _categories.length === 0 ? (
    <></>
  ) : (
    <p {...rest}>
      {_categories.sort().map((c, i) => (
        <Fragment key={i}>
          {i === 0 ? '' : ' '}
          <span>{(i === 0 ? `` : `/ `) + `${c}`}</span>
        </Fragment>
      ))}
    </p>
  )
}
