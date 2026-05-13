import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:5000'

function App() {
  const [ports, setPorts] = useState([])
  const [selectedPort, setSelectedPort] = useState('')
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState('Not connected')

  // Fetch available serial ports on mount
  useEffect(() => { fetchPorts() }, [])

  async function fetchPorts() {
    const res = await fetch(`${API}/ports`)
    const data = await res.json()
    setPorts(data.ports)
  }

  async function connect() {
    const res = await fetch(`${API}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ port: selectedPort })
    })
    const data = await res.json()
    if (data.status === 'connected') {
      setConnected(true)
      setStatus(`Connected to ${selectedPort}`)
    }
  }

  async function sendCommand(cmd) {
    if (!connected) return
    const res = await fetch(`${API}/command/${cmd}`, { method: 'POST' })
    const data = await res.json()
    setStatus(`Device replied: ${data.response}`)
  }

  return (
    <>
      <select value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)}>
        <option value="">Select a port...</option>
        {ports.map((p) => (
          <option key={p.port} value={p.port}>{p.port} — {p.description}</option>
        ))}
      </select>
      <button onClick={fetchPorts}>Refresh</button>
      <button onClick={connect} disabled={!selectedPort}>Connect</button>
      <p>{status}</p>
      <button className='proof' onClick={() => sendCommand('LED_ON')} disabled={!connected}>Send signal</button>
    </>
  )
}

export default App
