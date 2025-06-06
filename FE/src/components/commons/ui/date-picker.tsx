"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/commons/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/commons/ui/popover";
import { FormControl, FormField, FormLabel } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { Task } from "@/schemas/taskSchema";

export function DatePickerComponent({ form }: { form: UseFormReturn<Task> }) {
  return (
    <FormField
      control={form.control}
      name="deadline"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Deadline</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}>
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  console.log(date);
                  field.onChange(date?.toISOString());
                }}
                disabled={(date) =>
                  date <= new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
