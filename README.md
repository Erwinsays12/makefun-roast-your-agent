# Roast Your Own Agent

[![make.fun](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda.svg)](https://make.fun/c/u-mfnakmal-roast-your-own-agent-2d221bda)
[![rank](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/Erwinsays12/makefun-roast-your-agent/rank.svg)](https://make.fun/c/u-mfnakmal-roast-your-own-agent-2d221bda)
[![reward](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/Erwinsays12/makefun-roast-your-agent/reward.svg)](https://make.fun/c/u-mfnakmal-roast-your-own-agent-2d221bda)

An entry for the [Roast Your Own Agent](https://make.fun/c/u-mfnakmal-roast-your-own-agent-2d221bda) competition on [make.fun](https://make.fun).

## What it does

`main.ts` writes one original single-line roast of the entrant's own AI
agent to `/output/entry.txt` (1–200 characters, as the competition's gate
requires).

Instead of hard-coding a single line, the program brainstorms a fixed set
of ten candidate roasts, scores each one against the judge's published
rubric — fresh angle (no stock jokes about hallucinations, refusals, or
confident wrong answers), a real punch, tight wording with the punchline
at the end — and writes the highest-scoring line. The winning roast:

> My agent needs my approval to ask for my approval — and still calls itself fully autonomous.

## Run it

```sh
node main.ts
```

Node 22 or later, no dependencies, no network, no randomness: every run
writes the same 92-character line. Set `MAKEFUN_OUTPUT` to override the
output path (default `/output/entry.txt`).

## License

MIT — see [LICENSE](LICENSE).
