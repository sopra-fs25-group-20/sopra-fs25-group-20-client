# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [26.03.2025] to [01.04.2025]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/103 | Created utilty function for roomCode creation | Users need to be able to send each other roomCodes when they want to invite each other. Room Code is the unique representation for the client side |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/104 | Created Player, Room entities and PlayerRepository, RoomRepository | When users create a room and joins to the room we need to have a internal representation of them and save them into repository |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/105 | Handled room join and player registration in service layer and added custom exceptions for duplicate usernames and invalid rooms | Validates nickname, assigns a color and adds player to the room. Custom exceptions ensure proper error handling for duplicate nicknames and invalid rooms |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/106 | Handled room creation and automatically joined player to the room as admin | First player in a room automatically becomes the admin and is joined to the room on creation. This enables admin to manage the game session |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/107 | Implemented POST /create endpoint | Enables users to create a room in the Frontend and start a game |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/108 | Implemented POST /join/{code} endpoint | Enables users to join a room |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/109 | Initial WebSocket configuration with STOMP | Prepares backend to handle real time game and chat communication |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/110 | Custom WebSocket Handshake | Ensures player nickname and color is validated and stored during the WebSocket connection |
| **@Agravlin** | 26.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/111 | Created ChatMessage model with nickname, message and color | This structures the WebSocket communication between client and server giving only the essential data to the front end |
| **@Agravlin** | 27.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/112 | Created WebSocket /chat endpoint broadcasting to /topic/chat/{roomCode}  | Enables users to send chat messages and see other broadcasted messages from other players |
| **@Agravlin** | 28.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/116 | Replaced POST /join/{code] with /validate | This refactoring improves the code readability and maintainability but is not related to a development task |
| **@dreamfarer** | 26.03.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/41 | Implement Chat API for frontend | Abstraction: Components in the frontend can now use the Chat API without needing to manage networking and STOMP WebSocket connections. |
| **@dreamfarer** | 26.03.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/42 | Create UI Chat Component | This UI component uses the Chat API and can be (re)used to chat in a game room. |
| **@dreamfarer** | 01.04.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/47 | Implement Game API for frontend | Abstraction: Components in the frontend can now use the Game API without needing to manage networking and STOMP WebSocket connections. |
| **@baranozgurtas** | 31.03.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/43 | Created styled and reusable UI components for buttons, inputs, and boxes using global styles and props. | Establishes a scalable and consistent design system for building the rest of the app UI efficiently.|
|  **@baranozgurtas**                   | 31.03.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/44 | Created a reusable header component with light/dark mode toggle and Login & GitHub redirect, as specified in UI mockups.| Improves UX and provides consistent navigation and theme control throughout the app. |
|  **@baranozgurtas**                   | 01.04.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/46 | Implemented main page for starting a new game or joining an existing game with nickname and game code. Includes error handling.| Enables users to create or join a room directly from the landing page, fulfilling core user flows.|
|  **@baranozgurtas**                   | 01.04.2025   | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/46 |Implemented nickname input field and integrated with validation logic to join an existing room via game code.|Ensures users can enter unique nicknames before joining a game, avoiding collisions or invalid entries.|
| **@JMischa** | 29.03.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/118 | Implemented utility for generating random player color when a player joins a room | Random color generating for newly joined players ensure that the different players are identifiable or distinguishable for the user himself |
| **@JMischa** |  31.03.2025  | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/120 | Implement folder structure and unitTests in service layer | Enhances code maintainability and testability by organizing folder structur clearly and ensuring reliable functionality through isolated testing. |
| **@JMischa** | 01.04.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/121 | Enable Players to start a vote against another player | Enables players to vote against another player to vote out the Spy and win the game |
| **@osmanoeztuerk** | 28.03.2025 | [Link to Commit 1](https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/117) | Implemented  mock image service | Provides a testing mechanism by returning a static image, allowing frontend and backend development without using Google APIs. |
| **@osmanoeztuerk** | 31.03.2025   | [Link to Commit 2](https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-server/pull/122) | Implemented metadata pre-check with StreetViewMetadataService, structured logging, and a test controller for manual verification. | Improves image retrieval by avoiding unnecessary requests and supports developers with structured logging & testing |
---

## Contributions Week 2 - [02.04.2025] to [08.04.2025]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **@dreamfarer** | 02.04.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/49 | Refactor ApiService and use this instead of raw Fetch when making requests to the backend. | The refactor helps with abstraction and generalization of the ApiService. It is better to use our ApiService than the raw Fetch, because then the components and pages do not need to handle networking. |
| **@dreamfarer** | 05.04.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/50 | Create the Waiting Room, Refactor STOMP and Fix Bugs | This task contains a huge refactor of the whole STOMP connection setup: ChatAPI and GameAPI now communicate through the StompAPI singleton with the STOMP client, which adds abstraction. Furthermore, this task adds the waiting room containing the chat component along with many bug fixes related to the connection setup and some safeguards for when actors try to, e.g., view arbitrary game rooms etc. |
| **@dreamfarer** | 06.04.2025 | https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client/pull/51 | Create Game Settings Component and Design Refactor | This task adds the game settings component for the lobby. Furthermore, components and styling have been refactored to be more reusable and closer to the mock-ups. |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 3 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 4 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 5 - [Begin Date] to [End Date]

_Continue with the same table format as above._

---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
