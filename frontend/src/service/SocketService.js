import { io } from 'socket.io-client'

class SocketService {
    constructor() {
        this.socket = null
        this.listeners = new Map()
    }

    connect() {
        if (!this.socket) {
            this.socket = io('https://electronic-commerce-web.onrender.com', {
                transports: ['websocket', 'polling']
            })

            this.socket.on('connect', () => {
                console.log('✅ Socket connected:', this.socket.id)
            })

            this.socket.on('disconnect', () => {
                console.log('❌ Socket disconnected')
            })

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error)
            })
        }
        return this.socket
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.listeners.clear()
        }
    }

    on(event, callback) {
        if (!this.socket) {
            this.connect()
        }

        // Store listener for cleanup
        const wrappedCallback = (data) => {
            console.log(`🔔 Socket event received: ${event}`, data)
            callback(data)
        }

        this.socket.on(event, wrappedCallback)
        this.listeners.set(`${event}_${callback.name}`, wrappedCallback)
    }

    off(event, callback) {
        if (this.socket && this.listeners.has(`${event}_${callback.name}`)) {
            const wrappedCallback = this.listeners.get(`${event}_${callback.name}`)
            this.socket.off(event, wrappedCallback)
            this.listeners.delete(`${event}_${callback.name}`)
        }
    }

    emit(event, data) {
        if (this.socket) {
            console.log(`📤 Socket event emitted: ${event}`, data)
            this.socket.emit(event, data)
        }
    }
}

// Singleton instance
const socketService = new SocketService()
export default socketService