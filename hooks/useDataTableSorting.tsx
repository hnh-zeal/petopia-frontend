import { useRouter } from 'next/router'

interface DataTableSortingParams {
  sortBy: string | undefined
}

export const useDataTableSorting = ({ sortBy }: DataTableSortingParams) => {
  const router = useRouter()

  const handleClick = () => {
    const currentSortBy = router.query.sortBy as string | undefined
    const currentSortType = router.query.sortType as string | undefined

    let newSortType: 'asc' | 'desc'

    // If the column is already sorted, reverse the sort type, otherwise default to 'asc'
    if (currentSortBy === sortBy && currentSortType === 'desc') {
      newSortType = 'asc'
    } else {
      newSortType = 'desc'
    }

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        sortBy,
        sortType: newSortType,
      },
    })
  }

  return {
    handleClick,
    isSorted: router.query.sortBy === sortBy ? router.query.sortType : undefined,
  }
}
