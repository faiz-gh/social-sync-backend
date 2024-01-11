# SocialSync Backend

## Installation Instructions

**Step-1:** Fork and clone the repository.
```bash
git clone https://github.com/faiz-gh/social-sync-backend.git
```

**Step-2:** Download and Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop).

**Step-3:** Download and Install Node.js 18 LTS from [here](https://nodejs.org/en/download).

**Step-4:** After installing Docker Desktop, open the terminal and go to the project directory.
```bash
cd social-sync-backend
```
**Step-5:** Run the following command to install the dependencies.
```bash
npm install
```

**Step-6:** Run the following command to build and run the docker containers.
```bash
docker-compose up --build -d
```

## Tips

**1.** The server runs on http://localhost:4400.

**2.** To run the server locally, run the following command:
```bash
    npm run dev
```

**3.** 

**4.** You can access the database cli by running the following command:
```bash
    npm run db
```

**5.** You can access the database using the following credentials:
```bash
    host: 'localhost' || 'db'
    port: '5432'
    username: 'your_database_username'
    password: 'your_database_password'
    database: 'your_database_name'
```

