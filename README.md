# Crypto Portfolio Manager Backend

This project is a backend for Crypto Portfolio Manager

Before you start, make sure you have Docker install on your machine. You can download Docker [here](https://www.docker.com/get-started).

## Features

- Built with TypeScript, Node.js, and PostgreSQL
- Use Docker for easy deploy and scale
- CoinMarketCap API to fetch real-time cryptocurrency prices

## Getting Started

To get this project up and running on your local machine, follow these steps:

1. **Clone the repository**

```bash
    git clone https://github.com/thitiphongD/cpm_backend
    cd cpm_backend
```

2. Set up environment
   Create a `.env` file in the root directory with the following variables:

```bash
    DATABASE_URL=postgres://username:password@localhost:5432/database_name
    CMC_API_KEY=your_coinmarketcap_api_key
    HOST=localhost
    SERVER_PORT=8080
```

3. Start Docker

```bash
   docker-compose up
```

4. Access the API
   Docker are and running, you can access the API at `http://localhost:8080`.

### API Endpoints

- `POST/register` - Register a new user.
- `POST/login` - Authenticate a user.
- `POST/portfolio` - Get the current user's portfolio.
- `POST/portfolio/buy` - Add a new cryptocurrency to the user's portfolio.
- `PUT/portfolio/:id` - Update the quantity of a cryptocurrency in the
  portfolio.
- `DELETE/portfolio/:id` - Remove a cryptocurrency from the portfolio.
