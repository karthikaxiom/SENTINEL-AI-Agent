# SENTINEL — Autonomous Multi-Agent Decision Intelligence

MTech AI coursework prototype. A cooperative, deterministic software-agent pipeline for synthetic crisis resource allocation. Runs without an internet connection or dependencies. Not a real emergency response system.

## Run on Windows
1. Extract the ZIP. Open `index.html` in Chrome or Edge. Keep `engine.js` and `ui.js` beside it. Alternatively open the separately supplied standalone HTML (all code embedded).
2. Select Earthquake response. The initial mission runs automatically. Change resources and click Execute mission, or inject a disruption to trigger replanning.
3. Export evidence JSON to retain input, decisions, metrics and agent messages.

## Architecture
Orchestrator → Analyst → Strategist (DP search) → Critic (constraint checker) → Executor (simulation state) → Evaluator. A user-injected environmental event triggers the entire loop again. The agent roles are cooperating software modules, not independently trained models or parallel LLM processes. The optional LLM is advisory only. Human input supplies the structured mission; there is no autonomous natural-language goal parsing.

## Model and search
For region i, demand d, risk r (1–5), access cost a (1–4), and allocation v vehicles, t teams, k kits:
`served = min(d, floor(3*v/a), 2*t, k)`.
Utility = sum of `risk*served + 2*(served>0)`. Resource budgets are global upper bounds; allocations are nonnegative integers. The bonus encourages coverage but does not guarantee fairness. Each service unit requires a kit and sufficient team and transport capacity. These are invented classroom assumptions.

DP state F(i,V,T,K) stores best remaining utility. For each feasible served level n, consume ceil(n*a/3) vehicles, ceil(n/2) teams and n kits, and recurse on the next region. Maximize current utility plus remaining utility. Memoization avoids repeated states. Enumerating only minimum resource bundles is sufficient: extra allocations cannot improve utility for a fixed served level and can only reduce remaining resources. Thus the search is globally optimal under this model. Bound: O(N*V*T*K*D) time, O(N*V*T*K) states (stored plan suffixes add up to O(N) per state); actual search can be smaller. Tie-breaking uses the first encountered optimum. Equal-share baseline divides each resource independently; it is deliberately simple, not a state-of-the-art baseline.

## Tests
`node test.js` (Node.js optional, only needed for tests). See TEST_RESULTS.txt for actual output. 80 small generated cases independently checked against exhaustive allocation enumeration. Three scenarios plus four disruptions per scenario and zero-resource case tested; two invalid inputs rejected. Results are model utility, not real rescue outcomes.

## Optional LLM review
Python 3 standard library only. In PowerShell, from the extracted directory:
```powershell
$env:OPENAI_API_KEY = 'YOUR_OWN_KEY'
$env:SENTINEL_MODEL = 'gpt-4.1-mini'
python server.py
```
Open http://127.0.0.1:8765 and click Request AI critique. API access may incur cost; model availability depends on your account. Only synthetic mission data is sent. Never put your key into HTML, Git or screenshots. Server binds to loopback and does not store the key. To run offline just open index.html. Live provider calls have not been tested without credentials. Stop server with Ctrl+C.

## Limitations
Single-period static allocation, synthetic data, deterministic sequential agents, no real dispatch, no geospatial travel-time model, no learning, no guarantee of minimum coverage, no real-world validation. Replanning replaces the hypothetical plan rather than tracking already dispatched resources. Browser history is local and capped at 100 runs; export it for reproducibility. The optional LLM cannot execute actions or override the verified plan.
