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

export default function DriverForm({
  initialData = {},
  onSubmit,
  onCancel,
}: Props) {
  const [fields, setFields] = useState({
    licenseNumber: initialData.licenseNumber ?? '',
    phoneNumber:   initialData.phoneNumber   ?? '',
    address:       initialData.address       ?? '',
    city:          initialData.city          ?? '',
    state:         initialData.state         ?? '',
    zipCode:       initialData.zipCode       ?? '',
    carMake:       initialData.carDetails?.make         ?? '',
    carModel:      initialData.carDetails?.model        ?? '',
    carYear:       initialData.carDetails?.year?.toString() ?? '',
    carColor:      initialData.carDetails?.color        ?? '',
    plateNumber:   initialData.carDetails?.plateNumber  ?? '',
    vehicleType:   initialData.carDetails?.vehicleType  ?? '',
    latitude:      initialData.location?.coordinates?.[1]?.toString() ?? '',
    longitude:     initialData.location?.coordinates?.[0]?.toString() ?? '',
  })
  const [errors, setErrors] = useState<Record<string,string>>({})

  useEffect(() => {
    setFields({
      licenseNumber: initialData.licenseNumber ?? '',
      phoneNumber:   initialData.phoneNumber   ?? '',
      address:       initialData.address       ?? '',
      city:          initialData.city          ?? '',
      state:         initialData.state         ?? '',
      zipCode:       initialData.zipCode       ?? '',
      carMake:       initialData.carDetails?.make         ?? '',
      carModel:      initialData.carDetails?.model        ?? '',
      carYear:       initialData.carDetails?.year?.toString() ?? '',
      carColor:      initialData.carDetails?.color        ?? '',
      plateNumber:   initialData.carDetails?.plateNumber  ?? '',
      vehicleType:   initialData.carDetails?.vehicleType  ?? '',
      latitude:      initialData.location?.coordinates?.[1]?.toString() ?? '',
      longitude:     initialData.location?.coordinates?.[0]?.toString() ?? '',
    })
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: getFieldError(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const required = [
      'licenseNumber','phoneNumber','address','city','state','zipCode',
      'carMake','carModel','carYear','carColor','plateNumber','vehicleType'
    ] as const

    const newErrs: Record<string,string> = {}
    required.forEach(k => {
      if (!fields[k]) newErrs[k] = 'Required'
    })
    setErrors(newErrs)
    if (Object.keys(newErrs).length) return

    const formData = new FormData()
    const stored = JSON.parse(localStorage.getItem('driverData') || '{}')

    formData.append('driverId',   stored.id)
    formData.append('firstName',  stored.firstName)
    formData.append('lastName',   stored.lastName)

    formData.append('licenseNumber', fields.licenseNumber)
    formData.append('phoneNumber',   fields.phoneNumber)
    formData.append('address',       fields.address)
    formData.append('city',          fields.city)
    formData.append('state',         fields.state)
    formData.append('zipCode',       fields.zipCode)

    formData.append('carDetails.make',        fields.carMake)
    formData.append('carDetails.model',       fields.carModel)
    formData.append('carDetails.year',        fields.carYear)
    formData.append('carDetails.color',       fields.carColor)
    formData.append('carDetails.plateNumber', fields.plateNumber)
    formData.append('carDetails.vehicleType', fields.vehicleType)

    if (fields.latitude)  formData.append('latitude',  fields.latitude)
    if (fields.longitude) formData.append('longitude', fields.longitude)

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(
        [
          'licenseNumber','phoneNumber','address','city','state','zipCode',
          'carMake','carModel','carYear','carColor','plateNumber','vehicleType',
          'latitude','longitude'
        ] as const
      ).map(field => (
        <div key={field}>
          <Label htmlFor={field}>
            {field.replace(/([A-Z])/g,' $1').replace(/^./, str => str.toUpperCase())}
          </Label>
          <Input
            id={field}
            name={field}
            type={['latitude','longitude'].includes(field) ? 'number' : 'text'}
            step={['latitude','longitude'].includes(field) ? 'any' : undefined}
            value={fields[field]}
            onChange={handleChange}
            className={errors[field] ? 'border-red-500' : ''}
          />
          {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
        </div>
      ))}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
