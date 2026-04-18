export type InvestigationDetail = Record<string, string>

export type InvestigationResponse = {
  status: "success" | "error"
  investigation_type: string
  summary: string
  details: InvestigationDetail[]
  statistics: {
    total_events: number
    unique_ips: number
  }
  recommended_actions: string[]
}