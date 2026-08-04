export type GateId = "G0"|"G1"|"G2"|"G3"|"G4";
export type GateStatus = "planned"|"in_progress"|"submitted"|"accepted"|"payment_sent"|"paid"|"waived";
export interface MilestoneGate { id: GateId; projectId: string; name: string; amountCents: number; currency: string; paymentLinkUrl?: string; status: GateStatus; acceptedAt?: string; paidAt?: string; }
export function onPortalAccept(gate: MilestoneGate, input: { projectId: string; gateId: GateId; acceptedBy: string }) {
  if (gate.projectId !== input.projectId || gate.id !== input.gateId) return { gate, nextAction: "invalid" as const };
  if (gate.status === "paid" || gate.status === "waived") return { gate, nextAction: "already_paid" as const };
  return { gate: { ...gate, status: "accepted" as const, acceptedAt: new Date().toISOString() }, nextAction: "send_payment_link" as const };
}
export function onGatePaid(gate: MilestoneGate): MilestoneGate { return { ...gate, status: "paid", paidAt: new Date().toISOString() }; }
export function canStartNextGate(previous: MilestoneGate) { return previous.status === "paid" || previous.status === "waived"; }
