"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn(className)} {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="icon-sm"
      className={cn("h-8 w-8", className)}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      {...props}
    >
      <ChevronLeft className="size-4" />
      Prev
    </Button>
  );
}

function PaginationNext({
  className,
  disabled,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      {...props}
    >
      Next
      <ChevronRight className="size-4" />
    </Button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon-sm" }),
        "h-8 w-8 cursor-default",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

