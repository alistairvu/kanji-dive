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

const VocabFormSchema = z.object({
  vocab: z.string().min(0, {
    message: "You need at least one word.",
  }),
});

export function VocabForm(props: {
  setItems: Dispatch<SetStateAction<Note[] | undefined>>;
}) {
  const { setItems } = props;

  const [disabled, setDisabled] = useState(false);

  const vocabForm = useForm<z.infer<typeof VocabFormSchema>>({
    resolver: zodResolver(VocabFormSchema),
  });

  const queryClient = api.useUtils();

  async function onSubmit(data: z.infer<typeof VocabFormSchema>) {
    setDisabled(true);
    const result = await queryClient.note.findVocabToCreate.fetch({
      vocab: data.vocab.split("\n"),
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
          name="vocab"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vocab Items</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Add your vocab items here, one per line."
                  className="h-32"
                  {...field}
                />
              </FormControl>

              <FormDescription>
                Use this page to bulk add new vocab items and kanji contained in
                these items.
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
