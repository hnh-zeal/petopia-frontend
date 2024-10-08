import uniqolor from "uniqolor";

export function generateColor(index: string, opacity?: number) {
  return opacity
    ? `${uniqolor(index).color}` + opacity
    : `${uniqolor(index).color}`;
}
