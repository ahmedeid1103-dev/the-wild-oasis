export type ActionState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
  message?: string;
};
