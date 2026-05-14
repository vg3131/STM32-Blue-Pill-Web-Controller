# Raspberry Pico Web Controller

A web interface for controlling a Raspberry Pi Pico microcontroller over USB serial. Select a port, connect to the board, choose a command from the dropdown, and send it — the Pico receives the signal and acts on it in real time.

## Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI + pyserial
- **Device:** Raspberry Pi Pico 2
- **Connection:** USB serial (`/dev/cu.*` on macOS)

## Project Structure

```
project/
├── firmware/
│   └── main.ino
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx
```

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

Open `firmware/main.ino` in the Arduino IDE and flash it to the Pico.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ports` | Returns a list of available serial ports |
| POST | `/connect` | Opens a serial connection to the specified port |
| POST | `/command/{cmd}` | Sends a text command to the device |

## Supported Commands

| Command | Description |
|---------|-------------|
| `LED_ON` | Turns the onboard LED on |
| `LED_OFF` | Turns the onboard LED off |

## Hardware Notes

- **Baud rate** must be 9600 on both the firmware and backend
- The Pico **resets when the serial port opens** — the backend waits 2 seconds after connecting before accepting commands
- On macOS, serial ports appear as `/dev/cu.*`. On Linux, `/dev/ttyUSB0` or `/dev/ttyACM0`. On Windows, `COM3`, `COM4`, etc.
- To test the serial connection without the web interface: `echo "LED_ON" > /dev/cu.usbmodem1101`
