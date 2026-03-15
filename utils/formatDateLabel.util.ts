export function formatDateLabel(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("T")[0].split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}