export class ChromeProtocol {
  constructor(socket, onEvent) {
    this.socket = socket
    this.nextId = 1
    this.pending = new Map()
    this.onEvent = onEvent
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id) {
        const request = this.pending.get(message.id)
        if (!request) return
        clearTimeout(request.timeout)
        this.pending.delete(message.id)
        if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`))
        else request.resolve(message.result)
      } else {
        this.onEvent(message)
      }
    })
    socket.addEventListener('close', () => this.rejectPending('Chrome WebSocket closed'))
    socket.addEventListener('error', () => this.rejectPending('Chrome WebSocket error'))
  }

  static async connect(url, onEvent) {
    const socket = new WebSocket(url)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.close()
        reject(new Error('Timed out connecting to Chrome'))
      }, 15_000)
      socket.addEventListener('open', () => { clearTimeout(timeout); resolve() }, { once: true })
      socket.addEventListener('error', () => {
        clearTimeout(timeout)
        reject(new Error('Could not connect to Chrome'))
      }, { once: true })
    })
    return new ChromeProtocol(socket, onEvent)
  }

  request(method, params = {}, sessionId, timeoutMs = 15_000) {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState !== WebSocket.OPEN) {
        reject(new Error(`Chrome is not connected: ${method}`))
        return
      }
      const id = this.nextId++
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Timed out after ${timeoutMs}ms: ${method}`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timeout, method })
      try {
        this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      } catch (error) {
        clearTimeout(timeout)
        this.pending.delete(id)
        reject(error)
      }
    })
  }

  session(sessionId) {
    return (method, params = {}, timeoutMs = 15_000) => this.request(method, params, sessionId, timeoutMs)
  }

  rejectPending(message) {
    for (const { reject, timeout } of this.pending.values()) {
      clearTimeout(timeout)
      reject(new Error(message))
    }
    this.pending.clear()
  }

  close() {
    this.rejectPending('Chrome session closed during cleanup')
    this.socket.close()
  }
}

export function debuggingUrl(chrome) {
  return new Promise((resolve, reject) => {
    let stderr = ''
    const timeout = setTimeout(() => finish(new Error('Timed out waiting for Chrome DevTools endpoint')), 20_000)
    function finish(error, url) {
      clearTimeout(timeout)
      chrome.stderr.off('data', onData)
      chrome.off('error', onError)
      chrome.off('exit', onExit)
      if (error) reject(new Error(`${error.message}\n${stderr.slice(-2000)}`))
      else resolve(url)
    }
    function onData(chunk) {
      stderr = (stderr + String(chunk)).slice(-12_000)
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (match) finish(null, match[1])
    }
    function onError(error) { finish(error) }
    function onExit(code, signal) { finish(new Error(`Chrome exited before startup: ${code ?? signal}`)) }
    chrome.stderr.on('data', onData)
    chrome.once('error', onError)
    chrome.once('exit', onExit)
  })
}

export async function evaluate(send, expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
  }
  return result.result.value
}

