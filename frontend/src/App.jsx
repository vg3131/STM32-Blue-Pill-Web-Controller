import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:5000'

function App() {
  const [ports, setPorts] = useState([])
  const [selectedPort, setSelectedPort] = useState('')
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState('Not connected')
  const [statusType, setStatusType] = useState('') // '', 'connected', 'error'
  const [connecting, setConnecting] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState('LED_ON')

  const commands = ['LED_ON', 'LED_OFF']

  // Fetch available serial ports on mount
  useEffect(() => { fetchPorts() }, [])

  async function fetchPorts() {
    try {
      const res = await fetch(`${API}/ports`)
      const data = await res.json()
      setPorts(data.ports)
    } catch (e) {
      setStatus('Error: could not reach backend')
      setStatusType('error')
    }
  }

  async function connect() {
    setConnecting(true)
    setStatus('Connecting...')
    setStatusType('')
    try {
      const res = await fetch(`${API}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port: selectedPort })
      })
      const data = await res.json()
      if (data.status === 'connected') {
        setConnected(true)
        setStatus('Connected')
        setStatusType('connected')
      } else {
        setStatus(`Error: ${data.detail || 'could not connect'}`)
        setStatusType('error')
      }
    } catch (e) {
      setStatus('Error: could not reach backend')
      setStatusType('error')
    } finally {
      setConnecting(false)
    }
  }

  async function sendCommand(cmd) {
    if (!connected) return

    let command = cmd;
    if (cmd === "LED_ON") {
      command = "N";
    } else if (cmd === "LED_OFF") {
      command = "F";
    }

    try {
      const res = await fetch(`${API}/command/${command}`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setStatus(data.response ? 'Success' : 'No response from device')
        setStatusType('connected')
      } else {
        setStatus(`Error: ${data.detail || 'command failed'}`)
        setStatusType('error')
      }
    } catch (e) {
      setStatus('Error: could not reach backend')
      setStatusType('error')
    }
  }

  return (
    <div className="card">
      <h1>Raspberry Pico <span>Controller</span></h1>
      <div className="divider" />

      <select value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)}>
        <option value="">Select a port...</option>
        {ports.map((p) => (
          <option key={p.port} value={p.port}>{p.port} — {p.description}</option>
        ))}
      </select>

      <div className="port-row">
        <button className="btn btn-ghost" onClick={fetchPorts}>Refresh</button>
        <button className="btn btn-primary" onClick={connect} disabled={!selectedPort || connecting}>
          {connecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>

      <select value={selectedCommand} onChange={(e) => setSelectedCommand(e.target.value)} disabled={!connected}>
        {commands.map((cmd) => (
          <option key={cmd} value={cmd}>{cmd}</option>
        ))}
      </select>

      <div className={`status-box ${statusType}`}>{status}</div>

      <button className="btn-send" onClick={() => sendCommand(selectedCommand)} disabled={!connected}>
        Send signal
      </button>
    </div>
  )
}

export default App
