"use client";
import OrganizationForm from "@/app/(web)/sysadmin/organizations/components/OrganizationForm";
import { createMyOrganizationAction } from "@/app/(web)/organizations/create/components/actions";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateOrganizationForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSubmit(data: { slug: string; name: string }) {
    const result = await createMyOrganizationAction(data);
    if (result?.data?.success) {
      console.log("INVALIDATE ALL QUERIES");
      router.push("/");
      router.refresh();
      queryClient.invalidateQueries();
      return;
    }
    return result;
  }

  async function onSuccess() {
    router.push("/");
  }

  return <OrganizationForm onSubmit={handleSubmit} onSuccess={onSuccess} />;
}
