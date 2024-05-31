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
import classNames from './index.module.css'
import { bffUrl } from '../../shared/lib'

export const EditCourse = ({ course }: { course: Course }) => {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const form = useForm({
    initialValues: {
      name: course.name,
      slug: course.slug,
      imageUrl: course.imageUrl,
      description: course.description,
      whatWillLearn: course.whatWillLearn,
      prerequisites: course.prerequisites,
    },

    validate: {
      name: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Name is required'
        }

        if (!z.string().min(3).safeParse(value).success) {
          return 'Name of course must be at least 3 characters long'
        }

        return null
      },
      imageUrl: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Image URL is required'
        }

        if (!z.string().url().safeParse(value).success) {
          return 'Image URL must be a valid URL'
        }

        return null
      },
      description: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Description is required'
        }

        if (!z.string().min(50).safeParse(value).success) {
          return 'Description must be at least 50 characters long'
        }

        return null
      },
      whatWillLearn: (value) => {
        if (!z.string().min(4).safeParse(value).success) {
          return "What you'll learn is required"
        }

        return null
      },
      prerequisites: (value) => {
        if (!z.string().min(4).safeParse(value).success) {
          return 'Prerequisites is required'
        }

        return null
      },
    },
  })

  const handleSubmit = async (values: {
    name: string
    imageUrl: string
    description: string
    whatWillLearn: string
    prerequisites: string
  }) => {
    setSubmitting(true)

    const response = await fetch(bffUrl('/courses'), {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ ...values, uid: course.uid }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = (await response.json()) as {
      success: boolean
      course: Course
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {
      notifications.show({
        title: 'Server error',
        message:
          'An unexpected error occurred while creating the course. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    if (data.success) {
      notifications.show({
        title: 'Course edited',
        message: 'Course has been successfully edited.',
        color: 'blue',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })

      router.push(`/studio/courses/${data.course.uid}`)
    }

    setSubmitting(false)
  }

  const handleNameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target

    form.setFieldValue('name', value)
    form.setFieldValue('slug', stringToSlug(value))
  }

  const handleUploadImage = async (files: File[]) => {
    setImageUploading(true)

    const formData = new FormData()

    formData.append('file', files[0] as Blob)

    const response = await fetch(bffUrl('/storage/upload'), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = (await response.json()) as {
      success: boolean
      fileUrl: string
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {
      notifications.show({
        title: 'Server error',
        message:
          'An unexpected error occurred while creating the course. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    if (data.success) {
      form.setFieldValue('imageUrl', data.fileUrl)
    }

    setImageUploading(false)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
      <Stack align="flex-end" gap="lg" w="100%">
        <Stack gap="xs" w="100%">
          <TextInput
            key={form.key('name')}
            label="Course Name"
            placeholder="Enter Course Name"
            size="md"
            {...form.getInputProps('name')}
            onChange={handleNameChange}
          />
        </Stack>
        <Group align="flex-start" gap="3px" justify="space-between" w="100%">
          <InputWrapper label="Preview Image" size="md" w="100%">
            {!form.getValues().imageUrl ? (
              <FileButton
                accept="image/png,image/jpeg,image/jpg,image/svg+xml                "
                multiple
                onChange={handleUploadImage}
              >
                {(props) => (
                  <Button
                    display="block"
                    loading={imageUploading}
                    mt="3px"
                    {...props}
                  >
                    Upload image
                  </Button>
                )}
              </FileButton>
            ) : (
              <Box mt="5px" pos="relative" w="400px">
                <Image
                  alt={form.getValues().name}
                  component={NextImage}
                  height={300}
                  maw="400px"
                  radius="md"
                  src={form.getValues().imageUrl}
                  width={400}
                />
                <Box
                  bg={rgba('dark.5', 0.5)}
                  bottom="0px"
                  p="xs"
                  pos="absolute"
                  style={{ borderRadius: '0px 0px 7px 7px' }}
                  w="100%"
                >
                  <Button
                    color="red.7"
                    leftSection={<IconX size="13px" stroke={3} />}
                    onClick={() => {
                      form.setFieldValue('imageUrl', '')
                    }}
                    size="compact-xs"
                    styles={{
                      section: {
                        marginRight: '3px',
                      },
                    }}
                  >
                    Remove Image
                  </Button>
                </Box>
              </Box>
            )}
          </InputWrapper>
        </Group>
        <Textarea
          key={form.key('description')}
          label="Description"
          placeholder="Enter Description"
          rows={4}
          size="md"
          w="100%"
          {...form.getInputProps('description')}
        />
        <InputWrapper
          error={form.errors.whatWillLearn}
          label="What you'll learn"
          size="md"
          w="100%"
        >
          <SimpleTextEditor
            error={Boolean(form.errors.whatWillLearn)}
            onChange={(value) => {
              form.setFieldValue('whatWillLearn', value)
            }}
            value={form.getValues().whatWillLearn}
          />
        </InputWrapper>
        <InputWrapper
          error={form.errors.whatWillLearn}
          label="Prerequisites"
          size="md"
          w="100%"
        >
          <SimpleTextEditor
            error={Boolean(form.errors.whatWillLearn)}
            onChange={(value) => {
              form.setFieldValue('prerequisites', value)
            }}
            value={form.getValues().prerequisites}
          />
        </InputWrapper>
        <Button loading={submitting} size="lg" type="submit">
          Edit
        </Button>
      </Stack>
    </form>
  )
}
