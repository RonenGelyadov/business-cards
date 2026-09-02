# BCard - Business Cards API

A RESTful API server for managing business cards, built with Node.js and Express. Users can register, create business cards, and manage them based on their role (regular user, business user, or admin).

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Running the server

```bash
npm start
```

### Running the server in development

```bash
npm run dev
```

## 🔐 Authentication

Most endpoints require a JWT token sent in the request header. After logging in via `/users/login`, use the returned encrypted token for subsequent authorized requests.

**Authorization levels:**

- `all` — no authentication required
- Registered user — any logged-in user
- Business user — a registered user with `isBusiness: true`
- The registered user / creator — only the user who owns the resource
- `admin` — admin users only

## 🔌 API Endpoints

### Users

| #   | URL            | Method | Authorization            | Action                     | Notice               | Return          |
| --- | -------------- | ------ | ------------------------ | -------------------------- | -------------------- | --------------- |
| 1   | `/users`       | POST   | all                      | Register user              | Email must be unique | Registered user |
| 2   | `/users/login` | POST   | all                      | Login                      |                      | Encrypted token |
| 3   | `/users`       | GET    | admin                    | Get all users              |                      | Array of users  |
| 4   | `/users/:id`   | GET    | Registered user or admin | Get user                   |                      | User            |
| 5   | `/users/:id`   | PUT    | Registered user          | Edit user                  |                      | Updated user    |
| 6   | `/users/:id`   | PATCH  | Registered user          | Change `isBusiness` status |                      | Updated user    |
| 7   | `/users/:id`   | DELETE | Registered user or admin | Delete user                |                      | Deleted user    |

### Cards

| #   | URL               | Method | Authorization                           | Action           | Return         |
| --- | ----------------- | ------ | --------------------------------------- | ---------------- | -------------- |
| 1   | `/cards`          | GET    | all                                     | Get all cards    | Array of cards |
| 2   | `/cards/my-cards` | GET    | Registered user                         | Get user's cards | Array of cards |
| 3   | `/cards/:id`      | GET    | all                                     | Get card         | Card           |
| 4   | `/cards`          | POST   | Business user                           | Create new card  | Card           |
| 5   | `/cards/:id`      | PUT    | The user who created the card           | Edit card        | Card           |
| 6   | `/cards/:id`      | PATCH  | Registered user                         | Like card        | Card           |
| 7   | `/cards/:id`      | DELETE | The user who created the card, or admin | Delete card      | Deleted card   |

## ⚠️ Error Handling

If a requested resource, route, or static file is not found, the server returns a `404` status with an appropriate error message/page.

## 🛠️ Built With

- Node.js
- Express
- JWT (JSON Web Tokens)
