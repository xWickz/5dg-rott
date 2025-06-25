export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
