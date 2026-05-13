# STM32 Blue Pill Web Controller

A web interface for controlling an STM32 Blue Pill microcontroller over USB serial. Built as a proof of concept — click a button in the browser, the LED on the board toggles.

## Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI + pyserial
- **Device:** STM32 Blue Pill with STM32duino firmware

## Getting Started

### 1. Backend

```bash
cd backend
pip3 install -r requirements.txt
uvicorn main:app --reload --port 5000
```

API will be available at `http://localhost:5000`. Interactive docs at `http://localhost:5000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`.

### 3. Firmware

Open `firmware/main.ino` in the Arduino IDE, select your board (`Tools → Board → STM32 Boards → Generic STM32F1 series`), and flash it to the Blue Pill.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ports` | Returns a list of available serial ports |
| POST | `/connect` | Opens a serial connection to the specified port |
| POST | `/command/{cmd}` | Sends a text command to the device |

