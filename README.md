# Instagram Mass Reporter

This demo implements improved username handling across the UI, client-side validation/sanitization, and a minimal server-side endpoint.

## Highlights

- Accepts usernames with or without `@`
- Sanitizes both client-side and server-side:
  - Trim whitespace
  - Remove a single leading `@` if present
  - Convert to lowercase
  - Validate characters: `a-z`, `0-9`, `.`, `_`, length `1–30`
- Displays normalized username with `@` for readability
- Stores usernames as `lowercase_without_leading_at`

## Running the server

1. Install Node.js (v16+ recommended).
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Server runs at `http://localhost:3000`.

### API

`POST /api/report`

Body:
```json
{
  "username": "@ExampleUser",
  "reports": [
    { "category": "scam", "quantity": 3 }
  ]
}
```

Responses:
- `200 OK`:
```json
{
  "success": true,
  "storedUsername": "exampleuser",
  "reportCount": 1
}
```
- `400 Bad Request`:
```json
{
  "error": "Invalid username — use only letters, numbers, periods, or underscores and 1–30 characters."
}
```

## Frontend tests

Open `index.html` and click "Enable Tests" then run tests to see sanitization results.

## Changelog

See `CHANGELOG.md` for a summary of changes.