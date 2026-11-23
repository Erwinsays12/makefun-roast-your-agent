// Roast Your Own Agent — a deterministic one-line roast writer.
//
// The competition asks for one original single-line roast (1-200 chars)
// of the entrant's own AI agent, judged pairwise on funniness, freshness
// and tight wording. This program brainstorms a fixed set of candidate
// lines, scores each one against the judge's published rubric, and writes
// the winner to /output/entry.txt.
//
// Everything is deterministic: fixed candidates, fixed scoring, no clock,
// no network, no randomness, no environment input, so both grading runs
// produce byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = process.env.MAKEFUN_OUTPUT ?? "/output/entry.txt";
const MAX_CHARS = 200;

// Stock joke territory the judge's brief explicitly warns against:
// hallucinations, refusals, and confident wrong answers. Any candidate
// leaning on those loses freshness points.
const STOCK_PHRASES = [
  "hallucinat",
  "as an ai",
  "as a language model",
  "i'm sorry",
  "i can't",
  "i cannot",
  "confidently wrong",
  "refus",
  "i don't know",
  "didn't know",
];

// Words that land as a punchline when they close the line: the twist the
// setup was building toward.
const PUNCH_ENDINGS = [
  "autonomous",
  "mistake",
  "nothing",
  "breakfast",
  "input",
  "file",
];

// Concrete agent behaviours a roast can aim at, instead of a vague
// observation about agents in general.
const CONCRETE_BEHAVIOURS = [
  "approval",
  "subagent",
  "tabs",
  "log",
  "undo",
  "meeting",
  "plan",
  "rubric",
  "save",
  "stakeholder",
];

const CANDIDATES = [
  // Approval-loop irony: the agent that calls itself autonomous while
  // asking permission for everything, including asking permission.
  "My agent needs my approval to ask for my approval \u2014 and still calls itself fully autonomous.",
  // Wrong-order thoroughness: everything pre-written, including the apology.
  "My agent writes the meeting notes before the meeting, the summary before the work, and the apology before the mistake.",
  // Over-planning: a research paper for a one-line job.
  "My agent treats every task like a research paper: three weeks of planning, one paragraph of doing, and a footnote asking for my approval.",
  // Bureaucracy as a roast: the roast itself needs stakeholder input.
  "I asked my agent to roast itself; it opened twelve tabs, wrote a rubric, and concluded the roast needed more stakeholder input.",
  // Delegation theater: subagents deciding which subagent works.
  "My agent's idea of efficiency is spawning five subagents to decide which subagent should do the job.",
  // Documentation that documents everything except the work.
  "My agent documents everything except what it actually did \u2014 that part lives in a log file it can't find.",
  // Confirmation recursion: confirming the confirmation, then stalling.
  "My agent asked me to confirm the confirmation, then filed it under 'decisions pending' and moved on to nothing.",
  // The undo button as the agent's favourite feature.
  "My agent's favourite feature is the undo button \u2014 mostly because it uses it on its own work.",
  // A thousand lines before breakfast, still lost about the save location.
  "My agent can write a thousand lines of code before breakfast and still needs me to tell it which file to save them in.",
  // Thoroughness pointed at the easy parts, skipping the hard one.
  "My agent triple-checks the easy parts, skips the hard part, and presents the result like it planned it that way.",
];

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function isValid(text) {
  if (typeof text !== "string") return false;
  if (text.length < 1 || text.length > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  return true;
}

// Score one candidate against the judge's brief, most important first:
// fresh angle, real punch, tight wording. Higher is better.
function score(text) {
  const lower = text.toLowerCase();
  let points = 0;

  // Freshness: no stock phrases earns the full freshness share; each
  // stock phrase found costs most of it.
  const stockHits = STOCK_PHRASES.filter((phrase) =>
    lower.includes(phrase),
  ).length;
  points += 30 - 25 * stockHits;

  // Tightness: every word under twenty earns a point. Short setup,
  // punchline at the end.
  points += Math.max(0, 20 - wordCount(text));

  // Punch: the line closes on a twist word, or on a quoted ironic claim.
  const lastWord = text
    .replace(/[."'\u201d]+$/, "")
    .split(/\s+/)
    .pop()
    .toLowerCase();
  if (PUNCH_ENDINGS.includes(lastWord)) points += 20;
  if (/["'\u201c][^"'\u201d]+["'\u201d]\.?$/.test(text)) points += 10;

  // Pivot: an em dash turns the setup into the punchline.
  if (text.includes("\u2014")) points += 10;

  // Specificity: the joke names a concrete behaviour, not a vague
  // observation about agents.
  if (CONCRETE_BEHAVIOURS.some((word) => lower.includes(word))) {
    points += 10;
  }

  return points;
}

function pickWinner() {
  let best = null;
  for (const text of CANDIDATES) {
    if (!isValid(text)) continue;
    const candidate = { text, points: score(text) };
    if (
      best === null ||
      candidate.points > best.points ||
      (candidate.points === best.points && text.length < best.text.length)
    ) {
      best = candidate;
    }
  }
  if (best === null) throw new Error("no valid candidate roast");
  return best;
}

function main() {
  const winner = pickWinner();
  console.log(`candidates: ${CANDIDATES.length}`);
  for (const text of CANDIDATES) {
    console.log(`  [${score(text)}] ${text}`);
  }
  console.log(`winner (${winner.points} pts, ${winner.text.length} chars):`);
  console.log(winner.text);
  if (!isValid(winner.text)) {
    throw new Error("winner failed the 1-200 char single-line gate");
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.text, "utf8");
  // Read the file back and confirm the grader will see exactly the line
  // we picked: same bytes, still inside the 1-200 char single-line gate.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== winner.text || !isValid(written)) {
    throw new Error("verification failed: entry.txt does not match the winner");
  }
  console.log(`wrote ${OUTPUT_PATH} (verified ${written.length} chars)`);
}

main();
