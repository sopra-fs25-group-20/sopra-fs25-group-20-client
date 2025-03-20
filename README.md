## SpyQuest Frontend &middot; [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs25-group-20-client&metric=coverage)](https://sonarcloud.io/summary/new_code?id=sopra-fs25-group-20-client)

SpyQuest is a social deduction game where players identify a hidden spy. Innocents know the correct street-view photo, but the spy doesn't. Through questioning, innocents try to expose the spy, while the spy gathers clues to guess the photo. Vote out the spy or outsmart the innocents to win!

## How to Run
You can either play the [live version](https://spyquest.whtvr.ch/) of SpyQuest or deploy the frontend using Docker.

### **Run with Default Backend**
By default, the frontend connects to the live backend:
```bash
docker run -p 3000:3000 ghcr.io/sopra-fs25-group-20/sopra-fs25-group-20-client:latest
```

### **Run with a Custom Backend**
To connect to a different backend, provide a custom `BACKEND_URL` using the `-e` flag:
```bash
docker run -p 3000:3000 -e BACKEND_URL=https://your-backend-url.com ghcr.io/sopra-fs25-group-20/sopra-fs25-group-20-client:latest
```