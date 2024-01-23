"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Note } from "@prisma/client";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const KanjiFormSchema = z.object({
  kanji: z.string().min(0, {
    message: "You need at least one kanji.",
  }),
});

export function KanjiForm(props: {
  setItems: Dispatch<SetStateAction<Note[] | undefined>>;
}) {
  const { setItems } = props;

  const [disabled, setDisabled] = useState(false);

  const vocabForm = useForm<z.infer<typeof KanjiFormSchema>>({
    resolver: zodResolver(KanjiFormSchema),
  });

  const queryClient = api.useUtils();

  async function onSubmit(data: z.infer<typeof KanjiFormSchema>) {
    setDisabled(true);
    const result = await queryClient.note.findKanjisToCreate.fetch({
      kanji: data.kanji.split(""),
    });
    setItems(result);
  }

  return (
    <Form {...vocabForm}>
      <form
        onSubmit={vocabForm.handleSubmit(onSubmit)}
        className="my-6 space-y-6"
      >
        <FormField
          control={vocabForm.control}
          name="kanji"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kanji Items</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Add your kanjis here."
                  className="h-32"
                  {...field}
                />
              </FormControl>

              <FormDescription>
                Use this page to bulk add new kanji to your lessons.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
