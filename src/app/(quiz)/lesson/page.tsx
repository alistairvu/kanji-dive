import { LessonSlides } from "@/components/lesson/lesson-slides";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const cards = await api.lesson.getNextLesson.query();
  const firstCard = cards[0];

  if (firstCard === undefined) {
    redirect("/dashboard");
  }

  return <LessonSlides cards={cards} />;
}
