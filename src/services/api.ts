export async function runInvestigation(payload: Record<string, string>) {
  const response = await fetch(import.meta.env.VITE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok || data.status === "error") {
    throw new Error(data.summary || "Request failed")
  }

  return data
}