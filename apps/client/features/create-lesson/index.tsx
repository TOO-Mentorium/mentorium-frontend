'use client'

import { useState } from 'react'
import {
  Button,
  InputWrapper,
  Stack,
  TextInput,
  Group,
  NumberInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { IconExclamationMark } from '@tabler/icons-react'
import type { Lesson } from '../../entities/lesson/types'
import { AdvancedEditor } from '../../components/advanced-editor'
import { bffUrl } from '../../shared/lib'

export const CreateLesson = ({ courseId }: { courseId: string }) => {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      averageTimeToRead: 0,
      content: '{}',
      interactiveComponents: '{}',
    },

    validate: {
      title: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Title is required'
        }

        if (!z.string().min(3).safeParse(value).success) {
          return 'Title of lesson must be at least 3 characters long'
        }

        return null
      },
      averageTimeToRead: (value) => {
        if (!z.number().min(1).safeParse(value).success) {
          return 'Average time to read is required'
        }

        return null
      },
      content: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Content is required'
        }

        if (!z.string().min(50).safeParse(value).success) {
          return 'Content must be at least 50 characters long'
        }

        return null
      },
    },
  })

  const handleSubmit = async (values: {
    title: string
    averageTimeToRead: number
    content: string
    interactiveComponents: string
  }) => {
    setSubmitting(true)

    const response = await fetch(bffUrl('/lessons'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ ...values, courseUid: courseId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = (await response.json()) as {
      success: boolean
      lesson: Lesson
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {
      notifications.show({
        title: 'Server error',
        message:
          'An unexpected error occurred while creating the lesson. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    if (data.success) {
      notifications.show({
        title: 'Lesson created',
        message: 'Lesson has been successfully created.',
        color: 'blue',
        autoClose: 5000,
      })

      router.push(`/studio/courses/${courseId}/lessons/${data.lesson.uid}`)
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
      <Stack gap="lg" w="100%">
        <Group gap="sm" w="100%" wrap="nowrap">
          <TextInput
            key={form.key('name')}
            label="Lesson Title"
            placeholder="Enter Lesson Title"
            size="md"
            variant="filled"
            w="100%"
            {...form.getInputProps('title')}
          />
          <NumberInput
            key={form.key('averageTimeToRead')}
            label="Average Time to Read"
            min={0}
            placeholder="Enter average time to read"
            size="md"
            suffix=" minutes"
            w="300px"
            {...form.getInputProps('averageTimeToRead')}
          />
        </Group>

        <InputWrapper
          error={form.errors.whatWillLearn}
          label="Content"
          size="md"
          w="100%"
        >
          <AdvancedEditor
            error={Boolean(form.errors.content)}
            mode="preview"
            onChange={({ content, interactiveComponents }) => {
              form.setFieldValue('content', content)
              form.setFieldValue('interactiveComponents', interactiveComponents)
            }}
            value={{
              content: form.getValues().content,
              interactiveComponents: form.getValues().interactiveComponents,
            }}
          />
        </InputWrapper>

        <Group justify="flex-end">
          <Button loading={submitting} size="md" type="submit">
            Create lesson
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
