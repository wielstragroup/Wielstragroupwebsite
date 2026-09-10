"use client";

import type { ButtonHTMLAttributes } from "react";

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmMessage: string;
};

/**
 * Submit-knop die eerst een bevestiging vraagt. Werkt binnen elke bestaande
 * `<form action={...}>`; alleen het klikgedrag verandert, de Server Action
 * blijft ongewijzigd.
 */
export function ConfirmSubmitButton({ confirmMessage, onClick, ...props }: ConfirmSubmitButtonProps) {
  return (
    <button
      {...props}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    />
  );
}
