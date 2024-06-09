"use client";

import { FaGoogle, FaRedditAlien } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginWithGoogle } from "@/actions/auth/loginWithGoogle";
import { loginWithReddit } from "@/actions/auth/loginWithReddit";

export const LoginProvider = () => {
  const googleMutation = useMutation({
    mutationFn: async () => {
      return await loginWithGoogle();
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      toast.error(error.message ?? "An error occurred");
    },
  });

  const redditMutation = useMutation({
    mutationFn: async () => {
      return await loginWithReddit();
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      toast.error(error.message ?? "An error occurred");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        onPress={() => googleMutation.mutate()}
        isLoading={googleMutation.isPending}
        startContent={<FaGoogle />}
        variant="flat"
      >
        Continue with Google
      </Button>
      <Button
        onPress={() => redditMutation.mutate()}
        isLoading={redditMutation.isPending}
        startContent={<FaRedditAlien />}
        variant="flat"
        className="bg-red-400 text-white"
      >
        Continue with Reddit
      </Button>
    </div>
  );
};
