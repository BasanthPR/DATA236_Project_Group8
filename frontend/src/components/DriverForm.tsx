import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getFieldError } from '@/utils/ValidationUtils'
import { DriverProfile } from '@/types/driver'

interface Props {
  initialData?: Partial<DriverProfile>
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}

interface FieldConfig {
  label: string
  type: string
  required: boolean
  pattern?: string
  min?: number
  max?: number
  step?: string
  placeholder?: string
  errorMessage?: string
}

const FIELD_CONFIGS: Record<string, FieldConfig> = {
  licenseNumber: {
    label: 'License Number',
    type: 'text',
    required: true,
    pattern: '^[A-Z0-9]{6,12}$',
    placeholder: 'Enter your driver license number',
    errorMessage: 'License number must be 6-12 alphanumeric characters'
  },
  phoneNumber: {
    label: 'Phone Number',
    type: 'tel',
    required: true,
    pattern: '^\\+?[1-9]\\d{1,14}$',
    placeholder: '+1234567890',
    errorMessage: 'Please enter a valid international phone number'
  },
  address: {
    label: 'Address',
    type: 'text',
    required: true,
    min: 5,
    max: 100,
    placeholder: 'Enter your street address',
    errorMessage: 'Address must be between 5 and 100 characters'
  },
  city: {
    label: 'City',
    type: 'text',
    required: true,
    min: 2,
    max: 50,
    placeholder: 'Enter your city',
    errorMessage: 'City must be between 2 and 50 characters'
  },
  state: {
    label: 'State',
    type: 'text',
    required: true,
    pattern: '^[A-Z]{2}$',
    placeholder: 'e.g., CA',
    errorMessage: 'Please enter a valid 2-letter state code'
  },
  zipCode: {
    label: 'ZIP Code',
    type: 'text',
    required: true,
    pattern: '^\\d{5}(-\\d{4})?$',
    placeholder: '12345 or 12345-6789',
    errorMessage: 'Please enter a valid ZIP code'
  },
  'carDetails.make': {
    label: 'Car Make',
    type: 'text',
    required: true,
    min: 2,
    max: 50,
    placeholder: 'e.g., Toyota',
    errorMessage: 'Car make must be between 2 and 50 characters'
  },
  'carDetails.model': {
    label: 'Car Model',
    type: 'text',
    required: true,
    min: 2,
    max: 50,
    placeholder: 'e.g., Camry',
    errorMessage: 'Car model must be between 2 and 50 characters'
  },
  'carDetails.year': {
    label: 'Car Year',
    type: 'number',
    required: true,
    placeholder: 'e.g., 2023'
  },
  'carDetails.color': {
    label: 'Car Color',
    type: 'text',
    required: true,
    min: 2,
    max: 30,
    placeholder: 'e.g., Silver',
    errorMessage: 'Car color must be between 2 and 30 characters'
  },
  'carDetails.plateNumber': {
    label: 'License Plate',
    type: 'text',
    required: true,
    placeholder: 'Enter your license plate number'
  },
  'carDetails.vehicleType': {
    label: 'Vehicle Type',
    type: 'text',
    required: true,
    min: 2,
    max: 30,
    placeholder: 'e.g., Sedan, SUV',
    errorMessage: 'Vehicle type must be between 2 and 30 characters'
  },
  latitude: {
    label: 'Latitude',
    type: 'number',
    required: true,
    min: -90,
    max: 90,
    step: 'any',
    placeholder: 'e.g., 37.7749',
    errorMessage: 'Latitude must be between -90 and 90'
  },
  longitude: {
    label: 'Longitude',
    type: 'number',
    required: true,
    min: -180,
    max: 180,
    step: 'any',
    placeholder: 'e.g., -122.4194',
    errorMessage: 'Longitude must be between -180 and 180'
  }
}

export default function DriverForm({
  initialData = {},
  onSubmit,
  onCancel,
}: Props) {
  const [fields, setFields] = useState({
    licenseNumber: initialData.licenseNumber ?? '',
    phoneNumber: initialData.phoneNumber ?? '',
    address: initialData.address ?? '',
    city: initialData.city ?? '',
    state: initialData.state ?? '',
    zipCode: initialData.zipCode ?? '',
    'carDetails.make': initialData.carDetails?.make ?? '',
    'carDetails.model': initialData.carDetails?.model ?? '',
    'carDetails.year': initialData.carDetails?.year?.toString() ?? '',
    'carDetails.color': initialData.carDetails?.color ?? '',
    'carDetails.plateNumber': initialData.carDetails?.plateNumber ?? '',
    'carDetails.vehicleType': initialData.carDetails?.vehicleType ?? '',
    latitude: initialData.location?.coordinates?.[1]?.toString() ?? '',
    longitude: initialData.location?.coordinates?.[0]?.toString() ?? '',
  })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFields({
      licenseNumber: initialData.licenseNumber ?? '',
      phoneNumber: initialData.phoneNumber ?? '',
      address: initialData.address ?? '',
      city: initialData.city ?? '',
      state: initialData.state ?? '',
      zipCode: initialData.zipCode ?? '',
      'carDetails.make': initialData.carDetails?.make ?? '',
      'carDetails.model': initialData.carDetails?.model ?? '',
      'carDetails.year': initialData.carDetails?.year?.toString() ?? '',
      'carDetails.color': initialData.carDetails?.color ?? '',
      'carDetails.plateNumber': initialData.carDetails?.plateNumber ?? '',
      'carDetails.vehicleType': initialData.carDetails?.vehicleType ?? '',
      latitude: initialData.location?.coordinates?.[1]?.toString() ?? '',
      longitude: initialData.location?.coordinates?.[0]?.toString() ?? '',
    })
  }, [initialData])

  const validateField = (name: string, value: string): string => {
    if (name === 'carDetails.year' || name === 'carDetails.plateNumber') return ''
    const config = FIELD_CONFIGS[name]
    if (!config) return ''

    if (config.required && !value) {
      return `${config.label} is required`
    }

    if (config.pattern && value && !new RegExp(config.pattern).test(value)) {
      return config.errorMessage || 'Invalid format'
    }

    if (config.min !== undefined && Number(value) < config.min) {
      return config.errorMessage || `Minimum value is ${config.min}`
    }

    if (config.max !== undefined && Number(value) > config.max) {
      return config.errorMessage || `Maximum value is ${config.max}`
    }

    if (config.min !== undefined && config.max !== undefined && 
        typeof value === 'string' && value.length < config.min) {
      return config.errorMessage || `Minimum length is ${config.min} characters`
    }

    if (config.min !== undefined && config.max !== undefined && 
        typeof value === 'string' && value.length > config.max) {
      return config.errorMessage || `Maximum length is ${config.max} characters`
    }

    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    const newErrors: Record<string,string> = {}
    Object.keys(fields).forEach(fieldName => {
      const error = validateField(fieldName, fields[fieldName])
      if (error) newErrors[fieldName] = error
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      const stored = JSON.parse(localStorage.getItem('driverData') || '{}')

      // Add user info
      formData.append('firstName', stored.firstName)
      formData.append('lastName', stored.lastName)

      // Add all form fields
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value)
      })

      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save changes. Please try again.'
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {Object.entries(FIELD_CONFIGS).map(([fieldName, config]) => (
        <div key={fieldName} className="space-y-2">
          <Label htmlFor={fieldName}>
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={fieldName}
            name={fieldName}
            type={config.type}
            value={fields[fieldName]}
            onChange={handleChange}
            placeholder={config.placeholder}
            min={config.min}
            max={config.max}
            step={config.step}
            pattern={config.pattern}
            required={config.required}
            aria-invalid={!!errors[fieldName]}
            aria-describedby={errors[fieldName] ? `${fieldName}-error` : undefined}
            className={errors[fieldName] ? 'border-red-500' : ''}
          />
          {errors[fieldName] && (
            <p id={`${fieldName}-error`} className="text-red-500 text-sm" role="alert">
              {errors[fieldName]}
            </p>
          )}
        </div>
      ))}

      {errors.submit && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md" role="alert">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
