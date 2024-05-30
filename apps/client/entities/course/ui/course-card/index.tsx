import {
  Card,
  CardSection,
  Stack,
  Group,
  Avatar,
  Button,
  Image,
  Text,
  ButtonGroup,
} from '@mantine/core'
import Link from 'next/link'
import NextImage from 'next/image'
import { IconEdit, IconExternalLink } from '@tabler/icons-react'
import type { CourseSimplified } from '../../types'

interface Props {
  course: CourseSimplified
  href: string
  withAuthor?: boolean
}

export const CourseCard = ({ course, withAuthor = true, href }: Props) => {
  return (
    <Card
      component={Link}
      href={href}
      key={course.uid}
      p="md"
      radius="md"
      shadow="sm"
    >
      <CardSection bg="dark.4">
        <Image
          alt={course.name}
          component={NextImage}
          height={200}
          src={course.imageUrl}
          width={300}
        />
      </CardSection>
      <Stack gap="xl" h="100%" justify="space-between" mt="xs">
        <Stack gap="xs">
          <Text fw={600} size="lg">
            {course.name}
          </Text>
          <Text lineClamp={4} size="sm">
            {course.description}
          </Text>
        </Stack>
        {withAuthor ? (
          <Group gap="xs" justify="flex-end">
            <Group gap="5px">
              <Avatar color="blue" size="sm">
                {course.author.username[0]?.toUpperCase()}
              </Avatar>
              <Text fw={500}>{course.author.username}</Text>
            </Group>
          </Group>
        ) : null}
        <Button
          rightSection={<IconEdit size="18px" stroke={2} />}
          variant="light"
        >
          View
        </Button>
      </Stack>
    </Card>
  )
}
