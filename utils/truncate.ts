export const truncate = (input: string) =>
  input?.length > 200 ? `${input.substring(0, 90)}...` : input;
