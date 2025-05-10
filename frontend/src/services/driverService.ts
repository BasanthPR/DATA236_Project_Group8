import axios from 'axios'
import { DriverProfile } from '@/types/driver'

// Payload for creating a new driver
export interface CreateDriverProfilePayload {
  driverId:      string
  firstName:     string
  lastName:      string
  email?:        string
  licenseNumber: string

  phoneNumber:   string
  address:       string
  city:          string
  state:         string
  zipCode:       string

  carDetails: {
    make:        string
    model:       string
    year:        number
    color:       string
    plateNumber: string
    vehicleType: string
  }

  // your backend expects this named “location”
  location?: {
    latitude:  number
    longitude: number
  }
}

const DRIVER_PORT = import.meta.env.VITE_DRIVER_SERVICE_PORT
const BASE_URL    = `http://localhost:${DRIVER_PORT}/api/drivers`

function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
api.interceptors.request.use(cfg => {
  const token = getAuthToken()
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const driverService = {
  async createProfile(body: CreateDriverProfilePayload): Promise<DriverProfile> {
    const res = await api.post('/profile', body)
    return res.data.data.driver
  },

  async updateProfile(formData: FormData): Promise<DriverProfile> {
    const res = await api.patch('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data.driver
  },

  // NEW: upload just the image
  async uploadMedia(formData: FormData): Promise<DriverProfile> {
    const res = await api.patch('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data.driver
  },

  async getProfile(): Promise<DriverProfile> {
    const res = await api.get('/profile')
    return res.data.data.driver
  }
}
