"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, uploadAvatar } from "./actions";
import { ProfileData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../submit-button";
import baseAvatar from "../../public/base_avatar.png";
import ImagePicker from "../image-picker";
import FormLabel from "../form-label";
import { ProfileFormValues, ProfileSchema } from "@/lib/schemas/profile";

type ProfileFormProps = {
  profile: ProfileData | undefined;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name,
    },
  });

  const { formState, handleSubmit } = form;

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setUpdating(true);
      const formData = new FormData();

      if (avatar) {
        formData.append("file", avatar);

        const { error: uploadError } = await uploadAvatar(formData);

        if (uploadError) {
          console.error("Upload failed:", uploadError);
        }
      }
      if (formState.isDirty) {
        const { error: updateError } = await updateProfile(data);

        if (updateError) {
          console.error("Updating profile failed:", updateError);
          // error toast
          return;
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setUpdating(false);
    }

    startTransition(() => {
      router.refresh();
    });

    setTimeout(() => {
      setAvatar(null);
    }, 3000);
    // success toast
    console.log("Success updating profile!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="size-[100px]">
        <ImagePicker
          file={avatar}
          setFile={setAvatar}
          fallbackImage={profile?.avatar_url || baseAvatar}
        />
      </div>

      <FormLabel
        formMethods={form}
        name="full_name"
        label="Full name:"
        errorMessage={formState.errors.full_name?.message}
        className="mt-2"
      />

      <SubmitButton
        className="w-[90px] mt-2"
        type="submit"
        disabled={
          updating ||
          isPending ||
          !formState.isValid ||
          !(formState.isDirty || avatar)
        }
      >
        {updating ? "Updating..." : "Update"}
      </SubmitButton>
    </form>
  );
}
