'use client'

import { TextInput } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export const SearchInput = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <TextInput
      defaultValue={searchParams.get('query')?.toString()}
      leftSection={<IconSearch size="20px" />}
      onChange={({ target }) => {
        handleSearch(target.value)
      }}
      placeholder="Search by course name or description"
      radius="sm"
      size="md"
      variant="filled"
      w="100%"
    />
  )
}
