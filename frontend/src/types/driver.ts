// src/types/driver.ts

// Car details sub-document (with color & vehicleType)
export interface DriverCarDetails {
  make:        string
  model:       string
  year:        number
  color:       string
  plateNumber: string
  vehicleType: string
}

// GeoJSON location returned by the API
export interface DriverLocation {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

// “currentLocation” on create is mapped server-side into DriverLocation
export interface DriverCurrentLocation {
  latitude:  number
  longitude: number
}

// A ride history entry
export interface DriverRide {
  id:          string
  date:        string      // ISO date or human-readable
  destination: string
  fare:        number
  passengerId: string
}

// A review entry
export interface DriverReview {
  id:          string
  rating:      number
  comment:     string
  date:        string
  passengerId: string
}

// The shape returned by your backend
export interface DriverProfile {
  driverId:      string
  firstName:     string
  lastName:      string
  email:         string
  licenseNumber: string

  phoneNumber:   string
  address:       string
  city:          string
  state:         string
  zipCode:       string

  carDetails:    DriverCarDetails
  location?:     DriverLocation
  imageUrl?:     string
  videoUrl?:     string

  ridesHistory:  DriverRide[]
  reviews:       DriverReview[]
}
