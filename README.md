# Medium Clone

Developed a clone of a official medium website, replicating all major functionalities. 
## Live Link - [https://medium-clone-jz8b.vercel.app](https://medium-clone-jz8b.vercel.app).

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#TechnologiesUsed)
- [Installation](#installation)
- [Contributing](#contributing)

## Features
- **Read Stories**: Enjoy a wide range of stories across various topics.
- **User Authentication**: Create an account to personalize your experience.
- **Write Stories**: Become an author and share your own stories with the community.
- **Engagement**:
  - **Like & Save**: Show appreciation for stories you love and save them for later.
  - **Comment & Reply**: Engage in discussions with comments and sub-comments.
  - **Edit & Delete Comments**: Modify or remove your comments as needed.
- **Follow System**:
  - **Follow Authors**: Keep up with your favorite authors and never miss their new stories.
  - **Gain Followers**: Build your own audience as an author.
  - **Follow Topics**: Stay updated on the topics that interest you.
  - **Mute Authors**: Customize your feed by muting authors you're not interested in.
- **Search Functionality**: Easily find stories, topics, and authors that pique your interest.
- **Author Profiles**: Learn more about authors with detailed bio and about sections.
- **Reading History**: Track your reading journey and revisit your favorite stories.

## Screenshots

| Sign In Page                      | Sign Up Page                       |
|-----------------------------------|------------------------------------|
| <img src="https://github.com/user-attachments/assets/9a8be0b2-9b10-41bb-983d-75c685062436" alt="Sign In Page" width="300"> | <img src="https://github.com/user-attachments/assets/7b4d8d5c-3987-491f-8fef-e4eab90e9e48" alt="Sign Up Page" width="300"> |

| Home Page                         | Read Story Page                    |
|-----------------------------------|------------------------------------|
| <img src="https://github.com/user-attachments/assets/bc86ae58-7671-46d0-a7c6-4de3ea0df35c" alt="Home Page" width="300"> | <img src="https://github.com/user-attachments/assets/f1f04170-6bc5-446e-8092-6dd15fef3124" alt="Read Story Page" width="300"> |

| Profile Page                      | Your Library Page                  |
|-----------------------------------|------------------------------------|
| <img src="https://github.com/user-attachments/assets/54846d70-1a64-4723-838a-31b01c09906a" alt="Profile Page" width="300"> | <img src="https://github.com/user-attachments/assets/888e3f7c-c6af-4143-82c5-60b013ea0f98" alt="Your Library Page" width="300"> |

| Your Stories Page                 | Refile Recommendations Page        |
|-----------------------------------|------------------------------------|
| <img src="https://github.com/user-attachments/assets/e8b3f1e3-538b-4aa3-8e64-3ad87da03057" alt="Your Stories Page" width="300"> | <img src="https://github.com/user-attachments/assets/b7ce23e0-6ffe-4579-afb7-7d5ccfd0f824" alt="Refile Recommendations Page" width="300"> |

| Write Story Page                  | Publish Story Page                 |
|-----------------------------------|------------------------------------|
| <img src="https://github.com/user-attachments/assets/c4ecafe3-88b5-4cca-8814-12aa7590059a" alt="Write Story Page" width="300"> | <img src="https://github.com/user-attachments/assets/1f3b9ae3-c8b5-4fe5-bdb7-c430eea691f3" alt="Publish Story Page" width="300"> |

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Zustand
  - Formik
- **Backend**:
  - Express
  - PostgreSQL
  - Prisma
- **Additional Tools**:
  - Cloudflare for DDoS protection
  - Zod for common type implementations

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Aayuslad/Medium-Clone.git
   ```

2. Install dependencies for both frontend and backend
   ```bash
    cd frontend
    npm install
    cd Express_backennd
    npm install
   ```

3. Set up environment variables:
   ```makefile
    DATABASE_URL=your_database_url
    CLOUD_NAME=your_cloud_name
    API_KEY=your_api_key
    API_SECRET=your_api_secret
    PORT=your_port
   ```
   
4. Run forntend anc backend
   ```
    cd Express_Backend
    npm run dev

    cd frontend
    npm run dev
   ```

## Contributing

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -m 'Add some feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.

Feel free to replace any placeholder text with your specific details and make any necessary adjustments.









