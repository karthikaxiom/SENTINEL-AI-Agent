# Five-minute demo and viva

## Demo sequence
**0:00 — Problem:** “Sir, I wanted to demonstrate an intelligent agent that makes decisions under resource constraints, rather than simply replying to questions. SENTINEL is my coursework prototype for simulated emergency resource allocation.” Explain your actual contribution and acknowledge AI-assisted development if asked or required by your course.

**0:40 — Architecture:** “The analyst observes the scenario. The strategist searches possible actions. The critic verifies constraints, the executor commits the plan in a simulation and the evaluator measures performance.” Point to the execution trace.

**1:15 — Run:** Select Earthquake response. The baseline utility is 42; optimized utility is 63; 12 units served. This is a 50% increase in the defined utility, not a 50% improvement in actual rescue outcomes. Explain risk-weighted service and coverage bonus.

**2:15 — Surprise:** Click −2 vehicles. The system automatically replans under three available vehicles. Baseline is 34 and optimized utility 47, with nine units served. The lower score than before is expected: resources decreased. Compare with the baseline under the same changed conditions. Show allocation totals.

**3:15 — Live challenge:** Ask the professor to choose a resource amount or disruption. Click Execute mission or inject the event. Show the trace and export evidence JSON.

**4:15 — Conclusion:** “The main result is not that this is ready for disaster deployment. It is that a goal-oriented agent can select a feasible action, evaluate it and adapt when the environment changes, using a reproducible search algorithm.”

## Memory palace
Door = observe; study desk = plan; security gate = verify; control room = execute; scoreboard = evaluate; alarm = replan. Recall this route when explaining the system.

## Viva
- Is this AI without an LLM? Yes, classical AI includes state-space search and utility-based rational agents. The planner uses exact optimization; the optional LLM is only a reviewer.
- Is it genuinely multi-agent? It is a cooperative role-based software-agent prototype, sequential and centrally orchestrated, not distributed or independently learning agents. Be precise about this.
- Why dynamic programming? Repeated remaining-resource states can be cached, reducing redundant computation while preserving optimality under the model.
- What is PEAS? Performance: utility and feasibility; Environment: synthetic regions/resources/events; Actuators: simulated allocation and replanning; Sensors: structured scenario inputs/events.
- Is the environment fully observable? Yes within the toy model; real disaster environments are not. It is discrete, deterministic between user-triggered changes, and dynamic when events arrive.
- Does it learn? No. It adapts by replanning rather than updating trained parameters.
- How do you verify? Independent brute-force comparisons for 80 small cases, feasibility checks and baseline comparison; see test results.
- Why not use an LLM for allocation? It may invent numbers or violate hard constraints. Exact search provides verifiable plans; a language model can add advisory critique.
- What about fairness? A coverage bonus is not a guarantee. Add minimum service constraints or multiobjective optimization as future work.
- What if all resources are zero? Valid zero allocation, zero utility, warning for unserved regions.
