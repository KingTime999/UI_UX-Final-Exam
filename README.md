
  # Modern Mobile UI Design

Dự án Modern Mobile UI Design được xây dựng với React, TypeScript, Vite và Tailwind CSS.

Dự án gốc có sẵn tại: https://www.figma.com/design/qiiBHCxpYiUkVkVPz59OzR/Modern-Mobile-UI-Design

## Yêu cầu hệ thống / System Requirements

- Node.js (phiên bản 16 trở lên / version 16 or higher)
- npm hoặc yarn

## Hướng dẫn cài đặt và chạy / Installation & Running

### 1. Cài đặt dependencies / Install dependencies

```bash
npm install
```

hoặc / or

```bash
npm i
```

### 2. Chạy development server / Start development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc cổng khác nếu 5173 đang được sử dụng)

The app will run at `http://localhost:5173` (or another port if 5173 is in use)

### 3. Build cho production / Build for production

```bash
npm run build
```

Các file đã build sẽ được tạo trong thư mục `dist/`

Built files will be generated in the `dist/` folder

## Cấu trúc dự án / Project Structure

```
src/
├── app/
│   ├── components/     # Các components chính
│   │   ├── ui/        # UI components (shadcn/ui)
│   │   └── figma/     # Components từ Figma
│   ├── context/       # React Context
│   └── routes.tsx     # Cấu hình routes
├── styles/            # Styles và themes
└── main.tsx          # Entry point
```

## Công nghệ sử dụng / Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Material-UI** - Additional UI components
- **React Router** - Routing

## Tài liệu / Documentation

- [Attributions](docs/ATTRIBUTIONS.md) - Thông tin về licenses và nguồn
  