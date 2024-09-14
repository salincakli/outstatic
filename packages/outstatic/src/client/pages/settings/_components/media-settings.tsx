import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetConfig } from '@/utils/hooks/useGetConfig'
import { useUpdateConfig } from '@/utils/hooks/useUpdateConfig'
import { ConfigSchema } from '@/utils/schemas/config-schema'
import { Button } from '@/components/ui/shadcn/button'
import { Input } from '@/components/ui/shadcn/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/shadcn/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/shadcn/dialog'
import { useEffect, useState } from 'react'
import { useOutstatic } from '@/utils/hooks'
import { Skeleton } from '@/components/ui/shadcn/skeleton'

export function MediaSettings() {
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { data: config, isPending } = useGetConfig()
  const { repoOwner, repoSlug } = useOutstatic()
  const onSubmit = useUpdateConfig({ setLoading })
  const form = useForm({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      repoMediaPath: config?.repoMediaPath || '',
      publicMediaPath: config?.publicMediaPath || ''
    }
  })

  const handleSubmit = () => {
    setShowConfirmModal(true)
  }

  const confirmSubmit = () => {
    setShowConfirmModal(false)
    onSubmit(form.getValues())
  }

  useEffect(() => {
    form.reset({
      repoMediaPath: config?.repoMediaPath || '',
      publicMediaPath: config?.publicMediaPath || ''
    })
  }, [config])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="repoMediaPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository Media Path</FormLabel>
                <FormControl>
                  {isPending ? (
                    <Skeleton className="w-100 h-10" />
                  ) : (
                    <Input placeholder="public/images/" {...field} />
                  )}
                </FormControl>
                <FormDescription>
                  The path where media files are stored in your repository.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicMediaPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Media Path</FormLabel>
                <FormControl>
                  {isPending ? (
                    <Skeleton className="w-100 h-10" />
                  ) : (
                    <Input placeholder="images/" {...field} />
                  )}
                </FormControl>
                <FormDescription>
                  The public path where media files are accessed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={
              loading ||
              (form.getValues('publicMediaPath') === config?.publicMediaPath &&
                form.getValues('repoMediaPath') === config?.repoMediaPath)
            }
            type="submit"
          >
            Update Media Paths
          </Button>
        </form>
      </Form>
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <p className="mb-2 mt-4">
                Future media uploads will be stored at:
              </p>
              <p className="mb-2 mt-4">
                <span className="font-medium">
                  github.com/{repoOwner}/{repoSlug}/
                  {form.getValues('repoMediaPath')}
                </span>
              </p>
              <p className="mb-2 mt-4">
                Future documents will show your media as:
              </p>
              <p className="mb-2 mt-4 font-medium">
                /{form.getValues('publicMediaPath')}image-example.png
              </p>
              <p className="mt-4">
                <span className="text-destructive font-medium">
                  Existing documents and media will NOT be updated.
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
