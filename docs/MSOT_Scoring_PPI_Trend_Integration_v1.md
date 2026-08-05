# ARMR ALEYE MSOT — Scoring Formula + Trend/PPI into PIE

## Scoring Formula (Drive Scoring Formula.docx) LOCKED v1

Total Score =
  (Startup * 0.10) + (Time * 0.15) + (Monthly * 0.15) + (Automation * 0.10) +
  (Passive * 0.10) + (Demand * 0.10) + (Competition * 0.10) + (Skill * 0.10) +
  (Scalability * 0.05) + (Trend * 0.05)

Inputs 0-1 (or 0-10 normalized /10).

Labels: >=0.75 whoopertunity | 0.55-0.74 expansion | 0.45-0.54 watch | 0.35-0.44 pivot | <0.35 floppertunity

Placement: near_term | plan_quarter | monitor | hold | defer

## Trend Engine 4-factor alias
Urgency=Time | Profitability=Monthly/Passive/Demand | Competition=Competition | Alignment=Skill/Automation/Startup

## PIE integration
POST /api/ppi/score — 10-factor
POST /api/ppi/signal — intake + score
POST /api/pie/match — optional signals/ppi
POST /api/pie/session — stages detect/match/ppi
GET /api/trend/blueprint

Claims: Educational only. No guaranteed income.

Worker: worker_trend_ppi_v3_1.js on Drive → deploy as src/index.js → version 3.1-trend-ppi
