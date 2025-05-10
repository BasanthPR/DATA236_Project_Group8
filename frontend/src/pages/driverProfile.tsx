// src/pages/DriverProfilePage.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, Edit2, Camera, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import DriverForm from '@/components/DriverForm'
import { DriverProfile } from '@/types/driver'
import { driverService, CreateDriverProfilePayload } from '@/services/driverService'
import axios from 'axios'

export default function DriverProfilePage() {
  const nav = useNavigate()

  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('driverData') || '{}') }
    catch { return {} }
  }, [])

  const [profile, setProfile] = useState<DriverProfile>({
    driverId:      storedUser.id       || '',
    email:         storedUser.email    || '',
    firstName:     storedUser.firstName|| '',
    lastName:      storedUser.lastName || '',
    licenseNumber: '',
    phoneNumber:   '',
    address:       '',
    city:          '',
    state:         '',
    zipCode:       '',
    carDetails:    { make:'',model:'',year:0,color:'',plateNumber:'',vehicleType:'' },
    location:      undefined,
    imageUrl:      undefined,
    ridesHistory:  [],
    reviews:       [],
  })

  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string|null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isNew, setIsNew]         = useState(false)
  const [tab, setTab]             = useState<'details'|'activity'|'upload'>('details')
  const [photoFile, setPhotoFile] = useState<File|null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await driverService.getProfile()
        setProfile({
          driverId:      data.driverId,
          email:         data.email,
          firstName:     data.firstName,
          lastName:      data.lastName,
          licenseNumber: data.licenseNumber,
          phoneNumber:   data.phoneNumber,
          address:       data.address,
          city:          data.city,
          state:         data.state,
          zipCode:       data.zipCode,
          carDetails:    data.carDetails,
          location:      data.location,
          imageUrl:      data.imageUrl,
          ridesHistory:  data.ridesHistory ?? [],
          reviews:       data.reviews      ?? [],
        })
        setIsNew(false)
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsNew(true)
        } else {
          console.error('Load profile error:', err)
          setError('Failed to load profile')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [storedUser])

  // Create / Update profile (JSON or multipart):
  const handleSave = async (formData: FormData) => {
    setLoading(true)
    try {
      let updated: DriverProfile

      if (isNew) {
        const payload: CreateDriverProfilePayload = {
          driverId:      formData.get('driverId')       as string,
          firstName:     formData.get('firstName')      as string,
          lastName:      formData.get('lastName')       as string,
          email:         profile.email,
          licenseNumber: formData.get('licenseNumber')  as string,

          phoneNumber:   formData.get('phoneNumber')    as string,
          address:       formData.get('address')        as string,
          city:          formData.get('city')           as string,
          state:         formData.get('state')          as string,
          zipCode:       formData.get('zipCode')        as string,

          carDetails: {
            make:        formData.get('carDetails.make')         as string,
            model:       formData.get('carDetails.model')        as string,
            year:        Number(formData.get('carDetails.year')),
            color:       formData.get('carDetails.color')        as string,
            plateNumber: formData.get('carDetails.plateNumber')  as string,
            vehicleType: formData.get('carDetails.vehicleType')  as string,
          },

          // renamed to match your service type
          location:
            formData.get('latitude') && formData.get('longitude')
              ? {
                  latitude:  Number(formData.get('latitude')),
                  longitude: Number(formData.get('longitude')),
                }
              : undefined,
        }

        updated = await driverService.createProfile(payload)
      } else {
        updated = await driverService.updateProfile(formData)
      }

      toast({ title: isNew ? 'Profile Created' : 'Profile Updated' })
      setProfile({
        ...updated,
        ridesHistory: updated.ridesHistory ?? [],
        reviews:      updated.reviews      ?? [],
      })
      setIsNew(false)
      setIsEditing(false)
      setTab('details')

    } catch (err) {
      console.error('Save profile error:', err)
      toast({
        title: 'Error',
        description: axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Save failed'
          : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Upload only photo
  const handleUploadImage = async () => {
    if (!photoFile) {
      toast({ title: 'No photo selected', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const mediaData = new FormData()
      mediaData.append('image', photoFile)
      const updated = await driverService.uploadMedia(mediaData)
      toast({ title: 'Photo uploaded!' })
      setProfile(prev => ({
        ...updated,
        ridesHistory: updated.ridesHistory ?? prev.ridesHistory,
        reviews:      updated.reviews      ?? prev.reviews,
      }))
      setTab('details')

    } catch (err) {
      console.error('Upload image error:', err)
      toast({
        title: 'Error uploading photo',
        description: axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Upload failed'
          : 'Unexpected error',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.clear()
    toast({ title: 'Signed out' })
    nav('/')
  }

  if (loading) return <div className="p-8 text-center">Loading…</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">
            {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Driver Profile'}
          </h1>
          <div className="flex space-x-2">
            {!isEditing && (
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-gray-100"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-gray-100"
              onClick={() => { setTab('upload'); setIsEditing(false) }}
            >
              <Camera className="h-4 w-4 mr-1" /> Add Image
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-gray-100"
              onClick={() => nav(-1)}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 text-red-700 border-t border-red-100">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-6">
          <Tabs
            value={tab}
            onValueChange={(v: string) =>
  setTab(v as 'details' | 'activity' | 'upload')
}
          >
            <TabsList className="flex space-x-1 bg-gray-100 rounded">
              {['details','activity','upload'].map(val => (
                <TabsTrigger
                  key={val}
                  value={val}
                  className="flex-1 py-2 text-center font-medium rounded hover:bg-white hover:shadow"
                >
                  {val === 'details' ? 'Profile Details'
                   : val === 'activity' ? 'Activity & Rides'
                   : 'Upload Photo'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* DETAILS */}
            <TabsContent value="details" className="mt-6">
              {isEditing
                ? <DriverForm initialData={profile} onSubmit={handleSave} onCancel={() => setIsEditing(false)} />
                : (
                  <Card className="shadow-none">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="mt-1 text-gray-800">{profile.email || '-'}</p>
                      </div>
                      {/* Phone */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="mt-1 text-gray-800">{profile.phoneNumber || '-'}</p>
                      </div>
                      {/* Address */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase">Address</p>
                        <p className="mt-1 text-gray-800">{profile.address || '-'}</p>
                      </div>
                      {/* City/State/ZIP */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase">City / State / ZIP</p>
                        <p className="mt-1 text-gray-800">
                          {profile.city || '-'} / {profile.state || '-'} / {profile.zipCode || '-'}
                        </p>
                      </div>
                      {/* Location */}
                      {profile.location && (
                        <div className="md:col-span-2 flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-indigo-500" />
                          <p className="text-gray-800">
                            {profile.location.coordinates[1].toFixed(4)}, {profile.location.coordinates[0].toFixed(4)}
                          </p>
                        </div>
                      )}
                      {/* Car */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase">Car</p>
                        <p className="mt-1 text-gray-800">
                          {profile.carDetails
                            ? `${profile.carDetails.make} ${profile.carDetails.model} (${profile.carDetails.year}) — Plate: ${profile.carDetails.plateNumber}`
                            : '-'}
                        </p>
                      </div>
                      {/* Photo */}
                      {profile.imageUrl && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase">Photo</p>
                          <img
                            src={
                              profile.imageUrl.startsWith('http')
                                ? profile.imageUrl
                                : `${import.meta.env.VITE_DRIVER_SERVICE_URL}/${profile.imageUrl}`
                            }
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="mt-2 h-32 w-32 rounded-lg object-cover border"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            {/* ACTIVITY */}
            <TabsContent value="activity" className="mt-6">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.ridesHistory.length > 0 ? (
                    <p className="text-gray-800">
                      You’ve completed <span className="font-semibold">{profile.ridesHistory.length}</span> rides
                    </p>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <User className="h-16 w-16 mx-auto mb-4" />
                      No ride history yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* UPLOAD PHOTO */}
            <TabsContent value="upload" className="mt-6">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Driver Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-600"
                      onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                    />
                    <Button onClick={handleUploadImage} className="w-full">
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sign out */}
        <div className="px-6 py-4 border-t text-center">
          <Button
            variant="outline"
            className="w-full py-3 text-red-600 hover:bg-red-50"
            onClick={signOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}