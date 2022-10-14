# math-practice

Just a simple game / drill tool to help my kids practice their time tables

Currently, it spits out single-digit multiplication problems,
advances to the next one when you get it right,
and counts your total wins.

## Run

Just host the files on a basic HTTP server. If you need something simple locally...

```bash
python3 -m http.server
```

## TODO

- Spoken input
- Add pause/reset buttons for timer
- Show upcoming problems
- Use rems (or whatever) instead of px
- Favicon
- Other operators
- Controls for number ranges to include
- Ability to practice a specific operand (e.g. 3 times tables but 3 as either the first or second digit)
- Branding
- Memorable domain
- Graphs!
- Leaderboards!
- Show live "pace" of correct answers over time

## Bugs

- You can type math operators like +/- in the answer box
