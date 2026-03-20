export const sentinelTrace = {
  contextSnapshotId: 'SNT-20260319-0847',
  agentMode: 'Program Status Agent',
  worldModelVersion: 'v2.0',
  components: [
    {
      index: 1,
      label: 'INPUT ACKNOWLEDGED',
      content: `Program: Project Sentinel (DOE NNSA). Context Snapshot ID: SNT-20260319-0847. Nodes read: Schedule status: Quarterly Review in 6 days (High confidence, System-generated). Budget: $7.6M contracted, burn rate 102% of planned at month 31 of 36 — above threshold (High confidence, Human-reported, last reconciled 4 days ago). Active risks: 4 risks on register; 2 rated High, 1 rated Critical (Critical risk: subcontractor deliverable delay with no mitigation owner assigned). Milestone status: Quarterly Review is a hard stakeholder deliverable. Stakeholder profile: NNSA Program Officer documented as detail-oriented; has escalated twice previously on programs where surprises arrived at formal reviews. No recovery plan on record for the Critical risk.`,
    },
    {
      index: 2,
      label: 'RULE APPLIED',
      content: `World Model DB, Universal Prior: "Clients penalize late disclosure more than early bad news. Notify proactively when a significant program event occurs, before the next scheduled review." Strengthened by Reference Norms DB, Client Patch (Override Priority: High): "This NNSA Program Officer has escalated on prior programs where surprises arrived at formal reviews — proactive notification is required for any High or Critical risk within 14 days of a formal review." Supporting rule: "A risk with no assigned mitigation owner is not mitigated." The Critical risk currently has no mitigation owner.`,
    },
    {
      index: 3,
      label: 'ALTERNATIVES CONSIDERED',
      content: `Alternative A: Present the current status at the Quarterly Review in 6 days without prior notification. Rejected: the Program Officer's documented escalation history on surprise disclosures means arriving at the Quarterly Review with an unannounced Critical risk creates higher stakeholder risk than proactive notification. The client norm override is explicit and high priority. Alternative B: Assign a mitigation owner internally and document a recovery plan before the Quarterly Review, presenting it as already in progress. Rejected: a recovery plan that does not yet exist cannot be presented as in progress. Doing so would constitute a misrepresentation to the client. Alternative C: Notify the Program Officer within 48 hours with a proactive risk disclosure, assign a mitigation owner by end of day, and present the recovery plan timeline at the Quarterly Review. Selected.`,
    },
    {
      index: 4,
      label: 'EXPLICIT ASSUMPTIONS',
      content: `Burn rate data is 4 days old (High confidence given recency). Assumed no material change in the past 4 days; if actuals have worsened, the urgency of the notification increases. The Critical risk's absence of a mitigation owner is inferred from an empty field in the Risk Register — it is possible an owner was verbally assigned but not documented. This assumption must be verified before notification is sent. The Quarterly Review date is confirmed as 6 days from today; if this has changed, the timing recommendation changes accordingly.`,
    },
    {
      index: 5,
      label: 'DATA CONFIDENCE ACKNOWLEDGMENT',
      content: `Critical nodes are at High confidence: burn rate (4-day-old reconciled data), Quarterly Review date (calendar-confirmed), stakeholder escalation history (documented in Reference Norms DB). The mitigation owner status for the Critical risk is Low confidence — inferred from field absence rather than direct verification. This recommendation is suitable for action with the explicit caveat that the mitigation owner status must be verified before notification content is finalized. If a mitigation owner has been assigned verbally, the recommendation remains the same but the urgency framing changes.`,
    },
    {
      index: 6,
      label: 'TRADEOFF JUSTIFICATION',
      content: `Mission Impact: Proactive notification does not affect program delivery. It changes the communication sequence, not the program trajectory. Compliance Risk: Proactive disclosure aligns with DOE/NNSA disclosure norms and removes Project Sentinel from "surprise disclosure" risk category for this review cycle. Stakeholder Risk: High — this is the dominant factor. The Program Officer's documented pattern means the cost of inaction (surprise at the Quarterly Review) materially exceeds the cost of action (early notification). Reversibility: High. An early notification can be updated as the recovery plan develops. A surprise at the Quarterly Review cannot be undiscovered. Tradeoff: Stakeholder Risk dominates. Proceed with proactive notification.`,
    },
  ],
  recommendation: {
    text: `Notify the NNSA Program Officer within 48 hours of the Critical risk status and its mitigation gap. Frame as a proactive risk disclosure, not a crisis report. Assign a mitigation owner by end of day today. Present the recovery plan timeline (not the completed plan) at the Quarterly Review in 6 days. Required actions before notification: verify whether a mitigation owner was verbally assigned and document accordingly; confirm burn rate actuals against today's invoicing records.`,
    rationale: `Stakeholder risk is the dominant factor — early notification prevents a high-consequence surprise at the formal review.`,
    confidence: 'High',
  },
};
