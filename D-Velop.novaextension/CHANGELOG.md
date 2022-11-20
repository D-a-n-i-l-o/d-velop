## Version 0.8.2

Fix for non-functional format command.

Added support for local symbol renaming (requires serve-d 0.8.0-beta.8 or better).

Note that due to the usual problem with Nova symbols (selections) starting in
columns 0 or 1, or rows 0 or 1, won't work. (Nova issues those as "true" and
"false" in range selections.)

## Version 0.8.1

Introduce special tasks for Weka.io staff (local compilation, testing).

More resilient issue matchers from compiler output.

Fixes for server restart (hopefully) to make it less brittle.

## Version 0.8.0

Introduce very limited support for DUB. (Will expand.)

Introduce symbolication (which helps the editor understand nesting
levels, and such. The symbols sidebar know provides useful data, and
completions will include some guidance about what is being completed.)

## Version 0.7.1

Bug fixes for download process.

## Version 0.7

Renamed to D-Velop.

Major refactoring of internal code.

Implemented support for checking/downloading serve-d from GitHub.

Access to preferences and server restart from GUI.

## Version 0.6

Various bug fixes.

## Version 0.5

Initial preview release
