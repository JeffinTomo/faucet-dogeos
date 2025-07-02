import { Button, extendVariants } from "@heroui/react";

export const CustomButton = extendVariants(Button, {
  variants: {
    textTransform: "capitalize",
    variant: {
      solid: "",
      faded: "",
    },
    color: {
      primary: "",
      secondary: "",
      danger: "",
      default: "",
    },
    isDisabled: {
      true: "bg-[#F5F5F9] text-[#C1C0D8] cursor-not-allowed",
    },
    size: {
      sm: "font-medium text-sm h-[34px]",
      md: "font-medium text-base h-[48px]",
      xl: "font-medium text-lg h-[56px]",
    },
    isIconOnly: {
      true: "aspect-square rounded-full w-auto",
    },
  },
  defaultVariants: {
    variant: "solid",
    radius: "full",
    size: "md",
    color: "default",
  },
  compoundVariants: [
    {
      variant: "solid",
      color: "primary",
      className: "bg-primary text-btn-primary-txt",
    },
    {
      variant: "faded",
      color: "primary",
      className: "bg-btn-faded-bg border-primary text-foreground",
    },
    {
      isDisabled: true,
      class: "bg-[#F5F5F9] text-[#C1C0D8] cursor-not-allowed",
    },
    {
      variant: "bordered",
      color: "danger",
      className: "border border-[#EB4B6D] text-[#EB4B6D] bg-transparent",
    },
    {
      variant: "bordered",
      color: "default",
      className: "text-[#000000] border border-[#EBEBF4] bg-[#FFF]",
    },
  ],
});
