# Papierkram Devkit

This workspace contains modules interacting with the API of [Papierkram](https://papierkram.de).
The goal is to automate tasks to simplify invoicing.

## [Toggl](https://togglc.com) connector

This connector loads time entries from Toggl and synchronizes them with Papierkram.
This allows to write invoices in Papierkram and automatically attaching the imported times from _Toggl_ as time sheet.

Furthermore, the Dashboard in Papierkram gets updated to visualize how much money has been earned.

### Features

- ✅ Create new Papierkram time entries from Toggl TimeEntries
- ✅ Update Papierkram time entries being imported form Toggl
- ✅ Archive Papierkram time entries that has been removed in Toogl

### How it works?

To modify a time entry that has been importet from Toggl, we need the possibility to identify which time entry in Papierkram was imported.
That's why the `Id` of the toggl time entry written to the comment of the respective time entry.
The toggl information are serialised to a JSON-string.
A time entry comment in Papierkram that has been imported looks like this:

```
This is what I have done...

---

{"meta":{"toggl":{"timeEntry":{"id":3841295324}}}}
```

### Prerequisites

#### pnpm

Install [pnpm](https://pnpm.io) to manage npm-dependencies

#### Encrypted .env-files

To be able to load information from Papierkram & Toggl we need some configuration and API-Keys.
These are safely stored in a `.env`-file that is read by the [NestJS](https://docs.nestjs.com/)-application.
[dotenvx](https://dotenvx.com/docs) encrypts the information living in the `.env`-file.
To decrypt the `.env`-file you need the private key.

> [!NOTE]
> If you want to use this repository for your own purposes,
> you can fork this repository and replace the existing `.env` with your own.

| Configuration entry     | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `papierkram_api_url`    | Base URL of Papierkram API                                     |
| `papierkram_api_token`  | Your API token from Papierkram                                 |
| `papierkram_project_id` | Identifies the project your want to read time entries from.    |
| `papierkram_user_id`    | Identifies the user for whom you want to sync time entries.    |
| `papierkram_task_id`    | Identifies the task that should be used to create time entries |
| `toggl_api_url`         | Base URL of Toggl API                                          |
| `toggl_api_token`       | Your API token from Toggl                                      |
| `toggl_api_token_label` | Your API token label from Toggle                               |

## Getting started

### Start Papierkram Devkit API

```bash
pnpm install
pnpm start # you need to have the private key for the encrypted .env-file
```

### Trigger import from Toggl

```http request
POST http://localhost:3000/api/imports/toggl

{
  "from": "2025-02-17",
  "to": "2025-02-23"
}
```

### Run tests

```
pnpm nx run papierkram-devkit-api:test
```
