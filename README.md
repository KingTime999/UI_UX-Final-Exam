
  # Modern Mobile UI Design

  This Modern Mobile UI Design project is built with React, TypeScript, Vite, and Tailwind CSS.

  Original source design:
  https://www.figma.com/design/qiiBHCxpYiUkVkVPz59OzR/Modern-Mobile-UI-Design

  ## Introduction

  Study Planner is a UX/UI prototype that helps users choose realistic tasks based on their current energy level. It combines energy-based task recommendations, Focus Mode, and supporting pages such as Analytics, World Rank, Music, OmeStudy, and Account.

  ## Team Members

  - Nguyen Thanh Son
  - Le Tan Nguyen
  - Vo Ngoc Phu
  - Tran Minh Khoa

  ## System Requirements

  - Node.js (version 16 or higher)
  - npm or yarn

  ## Installation and Run

  ### 1. Install dependencies

  ```bash
  npm install
  ```

  or

  ```bash
  npm i
  ```

  ### 2. Start development server

  ```bash
  npm run dev
  ```

  The app runs at `http://localhost:5173` (or another port if 5173 is already in use).

  ### 3. Build for production

  ```bash
  npm run build
  ```

  Build output is generated in the `dist/` folder.

  ## Project Structure

  ```
  src/
  ├── app/
  │   ├── components/     # Main components
  │   │   ├── ui/         # UI components (shadcn/ui)
  │   │   └── figma/      # Components imported from Figma
  │   ├── context/        # React Context
  │   └── routes.tsx      # Route configuration
  ├── styles/             # Styles and themes
  └── main.tsx            # Entry point
  ```

  ## Technologies

  - **React** - UI framework
  - **TypeScript** - Type safety
  - **Vite** - Build tool
  - **Tailwind CSS** - Styling
  - **shadcn/ui** - UI components
  - **Material-UI** - Additional UI components
  - **React Router** - Routing

  ## Documentation

  **Note:** All images in this project are for illustrative purposes only.

  - [Attributions](docs/ATTRIBUTIONS.md) - License and source information
  