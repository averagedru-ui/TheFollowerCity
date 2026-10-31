# Isometric city builder: asset kit + world map

Everything is drawn in code (Canvas 2D). No image files, no libraries, no build step.

## Run it
```
python serve.py
```
Then open:
- http://localhost:5173/          Asset Lab (browse and export every asset)
- http://localhost:5173/map.html  World map (infinite, chunked on demand) with claimable building plots

## Layout
```
src/iso.js          iso drawing kit (boxes, roofs, cylinders, facades)
src/colors.js       tone() = top/left/right shading, seeded rng
src/palette.js      shared palette (mutated by seasons)
src/season.js       season + holiday engine (date + latitude)
src/rig.js          oriented parts for vehicles/animals/aircraft
src/assets/*.js     the assets, grouped by theme
src/registry.js     every asset + preview settings
src/map/*.js        noise, world generator, map viewer
```

## Seasons and holidays
Auto mode reads today's date and your latitude (default Denver, CO). Hemisphere flips the seasons, the tropics stay summer.
Holidays decorate the run-up: Halloween (Oct 12 - Nov 1), Thanksgiving, Christmas, Valentine's, St. Patrick's, Easter, July 4th.
Override either from the dropdowns, or with `?season=winter&holiday=christmas` in the URL.

## Helper scripts (need Chrome installed)
```
./shot.sh Vehicles          # screenshot an Asset Lab category to PNG
./shotmap.sh name "seed=7"  # screenshot the map
```
See NAMES.md for name brainstorming.

## Playing and planning
- `map.html?seed=7` players: enter a name, click a free plot, **Claim** (one per person), pick a building from the build menu.
- `map.html?seed=7&admin=1` planner: **Plan** mode lays out plots (size, zone) and roads. Honor system, no login.
- `python serve.py` also stores the shared world in `data/world-<seed>.json`; opened without it, the world is saved per browser.
