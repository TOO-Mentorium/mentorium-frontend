'use client'

import { SegmentedControl, Group, Switch } from '@mantine/core'
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export const CoursesSort = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  if (!searchParams.has('sortBy')) {
    const params = new URLSearchParams(searchParams)

    params.set('sortBy', 'popularity')

    replace(`${pathname}?${params.toString()}`)
  }

  if (!searchParams.has('direction')) {
    const params = new URLSearchParams(searchParams)

    params.set('direction', 'DESC')

    replace(`${pathname}?${params.toString()}`)
  }

  const handleSortByChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    params.set('sortBy', value)

    replace(`${pathname}?${params.toString()}`)
  }

  const handleDirectionChange = (state: boolean) => {
    const params = new URLSearchParams(searchParams)

    if (state) {
      params.set('direction', 'DESC')
    } else {
      params.set('direction', 'ASC')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Group gap="sm">
      <SegmentedControl
        bg="dark.6"
        color="blue.7"
        data={[
          {
            label: 'Popularity',
            value: 'popularity',
          },
          {
            label: 'Name',
            value: 'name',
          },
          {
            label: 'Updated',
            value: 'updated',
          },
        ]}
        defaultValue={searchParams.get('sortBy')?.toString()}
        onChange={handleSortByChange}
        size="xs"
        w="250px"
      />
      <Switch
        defaultChecked={searchParams.get('direction') === 'DESC'}
        offLabel={<IconSortAscending size="18px" />}
        onChange={({ target }) => {
          handleDirectionChange(target.checked)
        }}
        onLabel={<IconSortDescending size="18px" />}
        radius="sm"
        size="lg"
      />
    </Group>
  )
}
