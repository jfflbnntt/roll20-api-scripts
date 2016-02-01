# roll20-api-scripts
various scripts for roll20, mostly suited for D&D 5E.

## SimpleTables
An attempt to demonstrate how to replace tables with simple scripts, since maintaining and copying tables in Roll20 can be cumbersome and scripts support dice functions.

## ConcentrationCheck
Simple script monitors tokens marked as concentrating for damage and sends a reminder to the DM that they need to make a concentration check including the DC.

## Herbalism
An implementation of the Herbalism tables from /u/dalagrath

## AdvancedFumbleTable
A homebrew fumble table with various effects and save DCs.

## WildMagicSurge
Basic implementation of the Wild Magic Surge table for Wild Sorcerers.

## SpellMishapTable
Simple table for scroll and spell mishaps from the DMG.

## ApiExtensions
global utility functions that support other scripts and macros

- parseInlineRolls: takes a message object and looks for inline dice and table rolls and replaces returns the processed content.
- statusMarkerHelpers: a bunch of helper functions that support managing token status markers by id

## SpeechBalloon
Simple speech balloons based on "Stephen S."'s [ideas](https://app.roll20.net/forum/post/1397909/script-dungeon-buddies-inspired-speech-balloons)

Supports showing multiple balloons at once and uses player's color as bubble tint and scales shown time to the length of the message.

Supports simple inline dice and table rolls if you have ApiExtensions/processInlineRolls.js installed

Some ideas not yet implemented:
- optional color parameter to command line
- optional token select parameter

## ConditionMarkers
(requires ApiExtensions/statusMarkerHelpers.js)
Maps standard 5e conditions to a fixed set of standard status markers. Supports setting, unsetting, toggling, and clearing conditions by name. Exports functions to be used by other scripts.

## MarkTarget
(requires ApiExtensions/statusMarkerHelpers.js)
Mark a target by token_id or selection with a specific status marker. Set, unset, toggle, and clear functions. Uses the same status marker as the "targeted" condition in ConditionMarkers. Designed to be used with a simple macro that clears old targets, announces the new target, and marks it.


