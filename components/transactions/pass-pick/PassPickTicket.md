# Goal

A club can **pass a single pick** or **pass all of its remaining picks**. The user chooses the pick
(or "all"), sees a short confirmation of what will be passed, then commits. Passing is not easily
undone — clear warning tone, strongest for "All Picks".

## Current behaviour to replicate

On draft night a club can decline to use a pick ("pass"), or pass on everything it has left —
typically because its list is full. Passing forfeits the pick(s), so the user needs to clearly see
what they're about to give up before committing. In the current app (**Transactions page → "Pass
Picks"**):

1. **Select the pick** to pass (dropdown of the project's picks).
2. **Choose scope** — pass _this pick only_, or _all remaining picks_ for that pick's club.
3. The **impact preview** loads underneath: a plain-language summary and the list of picks that will
   be passed.
4. Save commits it and the board updates.

Replicate this flow as-is; only the styling changes to the new design system.

## Endpoints

| Action          | Method + URL                                                  |
| --------------- | ------------------------------------------------------------- |
| Available picks | `GET /api/v1/transactions/fetch-all-picks-list/{project_id}/` |
| Preview         | `POST /api/v1/transactions/pass-picks-impact/{project_id}/`   |
| Commit          | `POST /api/v1/transactions/pass-picks/{project_id}/`          |

Payload (preview + commit identical):

```json
{ "pick_id": 12, "pass_type": "One Pick Only" } // pass_type: "One Pick Only" | "All Picks"
```

Preview response (`PassPickResponseSerializer`): `pass_summary` (string) + `picks_passed` (list).
That is the entire contract — there is no draft-order / points impact view; do not add one
(desired additions tracked in **#419**).

## Acceptance criteria

- [ ] Matches legacy fields/behaviour; new-design styling; desktop + mobile, light + dark.
- [ ] Both pass types work; "All Picks" carries a clear warning.
- [ ] Preview runs before commit; a failed preview never enables Pass.
- [ ] Commit persists; the Draft Picks board reflects the passed pick(s).
- [ ] Gated behind the rebuild draft-edit capability (#356).
