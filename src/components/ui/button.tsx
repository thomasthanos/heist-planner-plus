import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground border-b-4 border-primary/40 hover:from-primary/95 hover:to-primary/75 active:border-b-0 active:translate-y-1",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive/80 text-destructive-foreground border-b-4 border-destructive/40 hover:from-destructive/95 hover:to-destructive/75 active:border-b-0 active:translate-y-1",
        success:
          "bg-gradient-to-b from-success to-success/80 text-success-foreground border-b-4 border-success/40 hover:from-success/95 hover:to-success/75 active:border-b-0 active:translate-y-1",
        warning:
          "bg-gradient-to-b from-warning to-warning/80 text-warning-foreground border-b-4 border-warning/40 hover:from-warning/95 hover:to-warning/75 active:border-b-0 active:translate-y-1",
        outline:
          "border-2 border-border bg-gradient-to-b from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 border-b-4 border-b-border/60 active:border-b-2 active:translate-y-0.5",
        secondary:
          "bg-gradient-to-b from-secondary to-secondary/80 text-secondary-foreground border-b-4 border-secondary/40 hover:from-secondary/95 hover:to-secondary/75 active:border-b-0 active:translate-y-1",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
