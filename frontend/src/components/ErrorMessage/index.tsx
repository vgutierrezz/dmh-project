import React from 'react';

export interface Errors {
  types?: Record<string, string>;
  message?: string;
}

export interface ErrorMessageProps {
  errors?: Errors;
}

export const ErrorMessage = ({ errors }: ErrorMessageProps) => {
  const messages = errors?.types
    ? Object.values(errors.types)
    : errors?.message
    ? [errors.message]
    : [];

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul className="tw-flex tw-flex-col tw-gap-y-4 tw-pt-4 tw-bg-background">
      {messages.map((message, index) => (
        <li className="tw-text-error" key={`error-${index}`}>
          {message}
        </li>
      ))}
    </ul>
  );
};
