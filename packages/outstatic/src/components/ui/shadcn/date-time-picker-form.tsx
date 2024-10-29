'use client'

import { format } from 'date-fns'
import { cn } from '@/utils/ui'
import { Button } from '@/components/ui/shadcn/button'
import { Calendar } from '@/components/ui/shadcn/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/shadcn/popover'
import { TimePicker } from './time-picker'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/shadcn/form'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export function DateTimePickerForm({
  id,
  label,
  registerOptions
}: {
  id: string
  label?: string
  registerOptions?: RegisterOptions
}) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <FormField
      control={control}
      name={id}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col">
            {label ? (
              <FormLabel className="text-left">{label}</FormLabel>
            ) : null}
            <Popover>
              <FormControl>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(
                        field.value ? new Date(field.value) : new Date(),
                        'MMMM d, yyyy'
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePicker setDate={field.onChange} date={field.value} />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
