Changelog
=========
# Changelog

All notable changes to this project will be documented in this file.

---

## [4.0.0] - 2025-10-04

### Added
- Full compatibility with Homebridge 2.0
- Updated `config.schema.json` with modern format and preserved layout
- Polished `README.md` for Homebridge Verified status
- Added enhanced `.gitignore` for TypeScript and Homebridge development
- Improved `tsconfig.json` with type safety and performance flags
- Updated `.eslintrc` with modern linting rules and type-aware checks
- Validated `sample-config.json` against schema
- Reviewed and confirmed correctness of `index.ts` and `settings.ts`

### Changed
- Removed deprecated ESLint presets
- Added optional enhancements to `nodemon.json`

---

## [3.0.8] - 2024-12-12

### Added
- Initial support for garage door accessories
- Logging option for raw Elk M1 data

---

## [3.0.0] - 2023-08-01

### Added
- First public release of `homebridge-elkm1rmod`
- Support for Elk M1 zones, outputs, tasks, and arming/disarming

3.0.6
-----

- Update node dependencies to fix known vulnerabilities

3.0.5
-----
Fix mistaken removal of elkmon dependency

3.0.4
-----
Bump elkmon version 1.2.6

3.0.3
-----
Fix debug logging for zone tamper

3.0.2
-----

Update model for panel and serial number for garage door.

3.0.1
-----

Update readme to include verified status

3.0.0
-----

Re-written in Typescript
Add support for garage door obstruction monitoring
Add support for tamper detection on normally open and normally closed zones
Implement exponential backoff and retry for connection failures
Improved exception handling

2.0.0
-----

Support config form
Only import configured zones
Only configure specified tasks and outputs

1.1.15
------

Fix warning on Homebridge 1.3.0 - don't return state from SET operations

1.1.14
------

Really fix plugin registration name

1.1.13
------

Fix plugin registration name

1.1.12
------

Additional debug logging

1.1.11
------

Additional debug logging

1.1.10
------

Additional debug logging

1.1.9
-----

Fix crash on discovery fail

1.1.8
-----

Fix error reporting

1.1.7
-----

Add catch statement to catch errors with fetching M1 config

1.1.6
-----

Alternate handling of undefined zone names

1.1.5
-----

Fix issue with undefined zones in M1 causing initialisation failure when defined in Homebridge config

1.1.4
-----

Fix issue with unnamed objects - Fix #5

1.1.2
-----

Fix issue with alarm being disarmed as soon as it was triggered
Use a logical state other than 'Normal' to indicate an alarm

1.1.1
-----

* Use elkmon 1.0.0
* Handle network errors from elkmon module

1.1.0
-----

* Update dependencies

1.0.0
-----

* Initial release
