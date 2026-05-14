import asyncio
import time
import serial
import serial.tools.list_ports
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #frontend port
    allow_methods=["*"],
    allow_headers=["*"],
)

ser = None

class PortSelect(BaseModel):
    port: str

# GET /ports
# Scans the machine for available serial ports and returns them as a list.
# The frontend uses this to populate the port selector dropdown.
@app.get("/ports")
def get_ports():
    ports = serial.tools.list_ports.comports()
    return {"ports": [{"port": p.device, "description": p.description, "hwid": p.hwid} for p in ports]}

# POST /connect
# Opens a serial connection to the port specified in the request body.
# If a port is already open, it closes it first before opening the new one.
# Baud rate is fixed at 9600 to match the STM32 firmware.
@app.post("/connect")
def connect_port(body: PortSelect):
    global ser
    try:
        if ser and ser.is_open:
            ser.close()
        ser = serial.Serial(body.port, 9600, timeout=2)
        time.sleep(2)  # Wait for STM32 to reset after serial port opens
        return {"status": "connected", "port": body.port}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# POST /command/{cmd}
# Sends a text command (e.g. "LED_ON") to the STM32 over the open serial connection.
# Waits for a response line from the device (the firmware replies with "OK").
# Runs the blocking readline in a thread so it doesn't block the async event loop.
@app.post("/command/{cmd}")
async def send_command(cmd: str):
    if not ser or not ser.is_open:
        raise HTTPException(status_code=400, detail="No device connected")
    ser.write(f"{cmd}\n".encode())
    response = await asyncio.to_thread(ser.readline)
    return {"response": response.decode().strip()}