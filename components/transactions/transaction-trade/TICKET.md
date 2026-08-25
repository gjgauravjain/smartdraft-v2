## Summary

New transaction modal on the project draft board: a trade between two or more clubs. One modal
covers every trade and replaces both of the old trade menu entries. Trade Offers and Scenario
Planner wiring are not part of this ticket.

- **Workflow:** clubs agree a deal → open the modal → add each club and what it receives (picks
  and/or players) → the impact area shows points in and out, each club's hand before and after,
  and whether the deal is allowed → confirm.

## Mockup

Trade-modal-mock.html

Attached: a single-file interactive mock — download and open in a browser (needs internet).
It shows 9 display states, desktop and mobile, light and dark, with a state toggle on each
frame. The mock is the visual source of truth; where these instructions differ, the
instructions win.

## Instructions

1. Add "Trade" to the transactions menu on the draft board (same access gating as the other
   transaction modals — no extra gates). Remove both old trade entries.
2. Club lanes per the mock: two empty lanes to start, "+ Add club" for more. Each lane has a
   club select and Picks / Players chip rows, with a "pts in" subtotal (sum of pick points,
   shown before any preview).
3. Add-to-trade sheet, Picks tab: picks grouped by club, then year, then pick order; rows
   already in the trade are disabled; points on the right. Leave out picks whose `pick_status`
   is "Used".
4. Add-to-trade sheet, Players tab: search across all players. Pre-fill the "from" club when the
   player's current club is known and let the user change it; when unknown the user picks it.
   (Don't reuse the Father Son Bid player search — it hides drafted players.)
5. Adding a pick or player from a club not yet in the trade adds that club as a new lane
   automatically.
6. Refresh the preview on every change to the trade. Show the skeleton while loading — never
   stale numbers. If responses come back out of order, keep only the latest (number each
   request).
7. Impact area per the mock: headline layer (balance beam for 2 clubs, bars on one shared scale
   for 3+, tiles on mobile) plus the validity badge; detail layer (per-club in/out cards with
   expandable before/after hand strips) and Rule checks start collapsed. Meter fill: the biggest
   club difference in the current trade is a full bar, the rest in proportion — don't copy the
   mock's hardcoded 1,500-point scale. Hand strips show rounds 1–6 by default with a show-all
   option; highlight picks where `incoming` is true. Show `summary_description` only when
   validity is Warning or Invalid.
8. Invalid trade: red badge, and the middle of the beam shows the blocked reason instead of the
   score ("Even trade" must never headline a blocked deal — this overrides the mock). Confirm
   disabled; the footer note text comes from `summary_description`.
9. Confirm is enabled only when: 2 or more clubs are set, at least one pick or player is moving,
   the latest preview has returned, and validity is not "Invalid". On success close the modal
   and refresh the draft board and transaction history. A 400 response body is the same impact
   shape — show it (it says why the trade was blocked). Any other error: show the API's message
   and change nothing.
10. Mobile per the mock: full-height sheet, tiles pinned above the club tabs, sticky footer.
    Wrap the tiles to two rows above four clubs; make chip ✕ targets at least 44px; ellipsize
    long chip labels.

## Mapping

Example response: `transactions/tests/snapshots/trade_impact_2026_valid_swap.json` in the
backend repo.

| Element                  | Endpoint / field                                                                                                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------- |
| Club options             | project club list (same source as the other transaction modals); flags matched by `team_id`                                                                                                                                                  |
| Pick options + chips     | GET `api/v1/transactions/fetch-all-picks-list/<projectId>/` — label `display`, id `unique`, value `points`, owner `current_owner`, `year`, order `overall_pick`                                                                              |
| Player options           | search all players → `player_id`, `player_name`; "from" club → `from_team_id`                                                                                                                                                                |
| Preview / commit request | POST `api/v1/transactions/trade-impact/<projectId>/` (preview) and `.../trade/<projectId>/` (commit), same body: `{"teams": [{"team_id", "picks_in": [{"unique", "label"}], "players_in": [{"player_id", "player_name", "from_team_id"}]}]}` |
| Validity badge           | `summary_validity` — "Valid" / "Warning" / "Invalid"                                                                                                                                                                                         |
| Summary line             | `summary_description` — only on Warning/Invalid; red on Invalid                                                                                                                                                                              |
| Meter / bars / tiles     | per club: `net_result`, `pts_in`, `pts_out`                                                                                                                                                                                                  |
| "≈ pick N" line          | `net_result_equivalent_pick` — hide when null; shown for both winner and loser                                                                                                                                                               |
| Detail card in/out rows  | `picks_in`/`picks_out` (`{unique, pick_name, overall_pick}`), `players_in`/`players_out` (`{player_id, player_name}`), `pts_in`/`pts_out`                                                                                                    |
| Hand strips              | `hand_before`/`hand_after` — one `{year, picks, points}` per draft year; pick items `{pick, pick_status, pick_name, round, incoming}` — chip text `pick_name`                                                                                |
| Rule checks              | `validity_checks.trade_back_rule` / `.pick_exists` / `.picks_match` — each `{status: "Pass"                                                                                                                                                  | "Warning" | "Fail", description, picks}` |
| Commit success           | `201` `{transaction_description}` → close, refresh board + history                                                                                                                                                                           |
| Commit blocked           | `400` with the full impact response → show it, board unchanged                                                                                                                                                                               |

Notes: send each pick's `label` (its `display`) in the request — the backend uses it to warn
when a pick has changed since the list was loaded. The "from"-club pre-fill needs a backend
lookup that isn't built yet; until it exists the user picks the club manually.

## Acceptance criteria

- [ ] Modal opens from the draft board transactions menu and replaces both old trade entries.
- [ ] A trade can be built between 2, 3, or 4+ clubs; adding an asset from an outside club adds
      its lane automatically; pick chips show label and points while building.
- [ ] Preview refreshes on every change; skeleton while loading; out-of-date responses never
      show; a failed or Invalid preview keeps Confirm disabled.
- [ ] An Invalid trade is obvious without expanding anything: red badge and the blocked reason
      in the headline layer; Rule checks shows the failing check with its picks.
- [ ] Hand strips show before/after per draft year, incoming picks highlighted, rounds 1–6 by
      default with a show-all option.
- [ ] Confirm enabled only with 2+ clubs, at least one asset moving, and validity not Invalid; a
      successful confirm closes the modal, the board shows every club's updated hand, and the
      trade appears in transaction history.
- [ ] An API error shows the API's message and nothing on the board changes.
