import { CleanMinimalSignIn } from "@/components/ui/clean-minimal-sign-in";

export function AuthPanel({
  title,
  description,
  next = "/",
}: {
  title: string;
  description: string;
  next?: string;
}) {
  return (
    <CleanMinimalSignIn title={title} description={description} next={next} />
  );
}
