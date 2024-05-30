'use client'

import type { ChangeEvent } from 'react'
import { useState } from 'react'
import {
  Button,
  FileButton,
  InputWrapper,
  Stack,
  Text,
  TextInput,
  Image,
  Textarea,
  Group,
  Box,
  rgba,
  Title,
  NumberInput,
} from '@mantine/core'
import { stringToSlug } from '@repo/libs/string'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { IconExclamationMark, IconX } from '@tabler/icons-react'
import NextImage from 'next/image'
import { SimpleTextEditor } from '../../components/simple-text-editor'
import type { Course } from '../../entities/course'
import type { Lesson } from '../../entities/lesson/types'
import { AdvancedEditor } from '../../components/advanced-editor'
import classNames from './index.module.css'

export const CreateLesson = ({ courseId }: { courseId: string }) => {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

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

    console.log(values)

    // const response = await fetch('https://localhost:3000/api/courses/lessons', {
    //   method: 'POST',
    //   credentials: 'include',
    //   body: JSON.stringify({ ...values, courseId }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })

    // const data = (await response.json()) as {
    //   success: boolean
    //   lesson: Lesson
    //   error?: {
    //     message: string
    //     code: number
    //   }
    // }

    // if (!data.success) {
    //   notifications.show({
    //     title: 'Server error',
    //     message:
    //       'An unexpected error occurred while creating the course. Please try again later.',
    //     color: 'red',
    //     autoClose: 5000,
    //     icon: <IconExclamationMark size="20px" />,
    //   })
    // }

    // if (data.success) {
    //   router.push(`/studio/courses/${courseId}/lessons/${data.lesson.uid}`)
    // }

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
