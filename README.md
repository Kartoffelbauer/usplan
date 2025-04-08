# 📅 Ultimate [StarPlan](https://splan.hs-heilbronn.de) – Bachelor Thesis Project

This project is a modern, responsive calendar web application built as part of a Bachelor's thesis. It is designed to replace the existing timetable UI used by students at Hochschule Heilbronn, providing a cleaner, more intuitive, and mobile-friendly user interface.

---

## 🎯 Purpose

The goal of this project is to:
- Replace the current timetable frontend with a modern React-based interface
- Improve usability, accessibility, and responsiveness across all devices
- Connect seamlessly with the existing RESTful timetable backend of [StarPlan](https://splan.hs-heilbronn.de)

---

## 🛠️ Tech Stack

- **React** – UI framework for component-based development
- **Vite** – Fast build tool and dev server
- **Material UI (MUI)** – Component library for modern design
- **React Big Calendar** – Calendar component for weekly scheduling
- **date-fns** – Lightweight date manipulation library
- **MUI Date Pickers** – For sidebar navigation

---

## 🔌 Backend Integration

This app is designed to connect to the **[StarPlan](https://splan.hs-heilbronn.de) REST API** that powers the current timetable UI. It can fetch and display:
- Courses
- Rooms
- Timeslots

---

## 📱 Features

- 📅 Weekly calendar view (Google Calendar–style)
- 🖱 Clickable sidebar date picker for fast navigation
- 📱 Fully responsive layout (mobile-ready)
- 🎨 Custom Material UI design
- 🔁 Seamless navigation (Today / Previous / Next)

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Kartoffelbauer/usplan.git
cd usplan

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📄 License

[Apache License 2.0](./LICENSE)