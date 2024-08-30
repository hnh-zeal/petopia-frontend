export const truncate = (input: string, count?: number) => {
  const limit = count ? count : 200;
  return input?.length > limit ? `${input.substring(0, limit)}...` : input;
};
