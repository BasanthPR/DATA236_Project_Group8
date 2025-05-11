// src/pages/DriverProfilePage.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, Edit2, Camera, MapPin, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import DriverForm from '@/components/DriverForm'
import { DriverProfile } from '@/types/driver'
import { driverService, CreateDriverProfilePayload } from '@/services/driverService'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function DriverProfilePage() {
  const nav = useNavigate()

  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('driverData') || '{}') }
    catch { return {} }
  }, [])

  const [profile, setProfile] = useState<DriverProfile>({
    driverId: '',
    email: storedUser.email || '',
    firstName: storedUser.firstName || '',
    lastName: storedUser.lastName || '',
    licenseNumber: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    carDetails: {
      make: '',
      model: '',
      year: 0,
      color: '',
      plateNumber: '',
      vehicleType: ''
    },
    location: undefined,
    imageUrl: undefined,
    ridesHistory: [],
    reviews: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [tab, setTab] = useState<'details'|'activity'|'upload'|'uploadVideo'>('details')
  const [photoFile, setPhotoFile] = useState<File|null>(null)
  const [uploadError, setUploadError] = useState<string|null>(null)
  const [videoFile, setVideoFile] = useState<File|null>(null)
  const [uploadVideoError, setUploadVideoError] = useState<string|null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await driverService.getProfile()
        setProfile({
          driverId: data.driverId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          licenseNumber: data.licenseNumber,
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          carDetails: data.carDetails,
          location: data.location,
          imageUrl: data.imageUrl,
          ridesHistory: data.ridesHistory ?? [],
          reviews: data.reviews ?? [],
        })
        setIsNew(false)
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsNew(true)
        } else {
          console.error('Load profile error:', err)
          setError('Failed to load profile. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [storedUser])

  // Create / Update profile
  const handleSave = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    try {
      let updated: DriverProfile

      if (isNew) {
        const payload: CreateDriverProfilePayload = {
          driverId: storedUser.id,
          licenseNumber: formData.get('licenseNumber') as string,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          phoneNumber: formData.get('phoneNumber') as string,
          address: formData.get('address') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zipCode: formData.get('zipCode') as string,
          carDetails: {
            make: formData.get('carDetails.make') as string,
            model: formData.get('carDetails.model') as string,
            year: Number(formData.get('carDetails.year')),
            color: formData.get('carDetails.color') as string,
            plateNumber: formData.get('carDetails.plateNumber') as string,
            vehicleType: formData.get('carDetails.vehicleType') as string,
          },
          location: {
            latitude: Number(formData.get('latitude')),
            longitude: Number(formData.get('longitude'))
          }
        }
        updated = await driverService.createProfile(payload)
      } else {
        updated = await driverService.updateProfile(formData)
      }

      toast({ 
        title: isNew ? 'Profile Created' : 'Profile Updated',
        description: 'Your changes have been saved successfully.'
      })
      setProfile({
        ...updated,
        ridesHistory: updated.ridesHistory ?? [],
        reviews: updated.reviews ?? [],
      })
      setIsNew(false)
      setIsEditing(false)
      setTab('details')

    } catch (err) {
      console.error('Save profile error:', err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to save changes'
        : 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Upload only photo
  const handleUploadImage = async () => {
    if (!photoFile) {
      setUploadError('Please select a photo to upload')
      return
    }

    // Validate file type
    if (!photoFile.type.startsWith('image/')) {
      setUploadError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (photoFile.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB')
      return
    }

    setLoading(true)
    setUploadError(null)
    try {
      const mediaData = new FormData()
      mediaData.append('image', photoFile)
      const updated = await driverService.uploadMedia(mediaData)
      toast({ 
        title: 'Photo uploaded!',
        description: 'Your profile photo has been updated successfully.'
      })
      setProfile(prev => ({
        ...updated,
        ridesHistory: updated.ridesHistory ?? prev.ridesHistory,
        reviews: updated.reviews ?? prev.reviews,
      }))
      setPhotoFile(null)
      setTab('details')

    } catch (err) {
      console.error('Upload image error:', err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to upload photo'
        : 'An unexpected error occurred'
      setUploadError(errorMessage)
      toast({
        title: 'Error uploading photo',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Upload only video
  const handleUploadVideo = async () => {
    if (!videoFile) {
      setUploadVideoError('Please select a video to upload')
      return
    }
    // Validate file type
    if (!videoFile.type.startsWith('video/')) {
      setUploadVideoError('Please select a valid video file')
      return
    }
    // Validate file size (max 50MB)
    if (videoFile.size > 50 * 1024 * 1024) {
      setUploadVideoError('Video size should be less than 50MB')
      return
    }
    setLoading(true)
    setUploadVideoError(null)
    try {
      const mediaData = new FormData()
      mediaData.append('video', videoFile)
      const updated = await driverService.uploadMedia(mediaData)
      toast({
        title: 'Video uploaded!',
        description: 'Your profile video has been updated successfully.'
      })
      setProfile(prev => ({
        ...updated,
        ridesHistory: updated.ridesHistory ?? prev.ridesHistory,
        reviews: updated.reviews ?? prev.reviews,
      }))
      setVideoFile(null)
      setTab('details')
    } catch (err) {
      console.error('Upload video error:', err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to upload video'
        : 'An unexpected error occurred'
      setUploadVideoError(errorMessage)
      toast({
        title: 'Error uploading video',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.clear()
    toast({ 
      title: 'Signed out',
      description: 'You have been successfully signed out.'
    })
    nav('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white/80 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Driver Profile'}
          </h1>
          <div className="flex space-x-2 items-center">
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-red-50 text-red-600 border-red-200"
              onClick={signOut}
            >
              Sign out
            </Button>
            {!isEditing && (
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-indigo-50"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-indigo-50"
              onClick={() => { setTab('upload'); setIsEditing(false) }}
            >
              <Camera className="h-4 w-4 mr-1" /> Add Image
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-indigo-50"
              onClick={() => nav(-1)}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-8 mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="px-8 pt-8">
          <Tabs
            value={tab}
            onValueChange={(v: string) => setTab(v as 'details' | 'activity' | 'upload' | 'uploadVideo')}
          >
            <TabsList className="flex space-x-1 bg-indigo-50 rounded-lg p-1">
              {['details','activity','upload','uploadVideo'].map(val => (
                <TabsTrigger
                  key={val}
                  value={val}
                  className="flex-1 py-2 text-center font-semibold rounded-lg transition hover:bg-white hover:shadow"
                >
                  {val === 'details' ? 'Profile Details'
                   : val === 'activity' ? 'Activity & Rides'
                   : val === 'upload' ? 'Upload Photo'
                   : 'Upload Video'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* DETAILS */}
            <TabsContent value="details" className="mt-8">
              {isEditing
                ? <DriverForm initialData={profile} onSubmit={handleSave} onCancel={() => setIsEditing(false)} />
                : (
                  <Card className="shadow-none bg-transparent">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Email */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Email</p>
                        <p className="mt-1 text-gray-900 font-medium">{profile.email || '-'}</p>
                      </div>
                      {/* Phone */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Phone</p>
                        <p className="mt-1 text-gray-900 font-medium">{profile.phoneNumber || '-'}</p>
                      </div>
                      {/* Address */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Address</p>
                        <p className="mt-1 text-gray-900 font-medium">{profile.address || '-'}</p>
                      </div>
                      {/* City/State/ZIP */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">City / State / ZIP</p>
                        <p className="mt-1 text-gray-900 font-medium">
                          {profile.city || '-'} / {profile.state || '-'} / {profile.zipCode || '-'}
                        </p>
                      </div>
                      {/* Location */}
                      {profile.location && (
                        <div className="md:col-span-2 flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-indigo-500" />
                          <p className="text-gray-900 font-medium">
                            {profile.location.coordinates[1].toFixed(4)}, {profile.location.coordinates[0].toFixed(4)}
                          </p>
                        </div>
                      )}
                      {/* Car */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Car</p>
                        <p className="mt-1 text-gray-900 font-medium">
                          {profile.carDetails
                            ? `${profile.carDetails.make} ${profile.carDetails.model} (${profile.carDetails.year}) — ${profile.carDetails.color} — Plate: ${profile.carDetails.plateNumber}`
                            : '-'}
                        </p>
                      </div>
                      {/* Photo */}
                      {profile.imageUrl && (
                        <div className="md:col-span-2 flex flex-col items-start">
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Photo</p>
                          <img
                            src={
                              profile.imageUrl.startsWith('http')
                                ? profile.imageUrl
                                : `${import.meta.env.VITE_DRIVER_SERVICE_URL}/${profile.imageUrl}`
                            }
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="mt-2 h-36 w-36 rounded-full object-cover border-2 border-indigo-200 shadow-md"
                          />
                        </div>
                      )}
                      {/* Video */}
                      {profile.videoUrl && (
                        <div className="md:col-span-2 flex flex-col items-start mt-4">
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Video</p>
                          <video
                            src={
                              profile.videoUrl.startsWith('http')
                                ? profile.videoUrl
                                : `${import.meta.env.VITE_DRIVER_SERVICE_URL}/${profile.videoUrl}`
                            }
                            controls
                            className="mt-2 w-full max-w-md rounded-xl border-2 border-indigo-200 shadow-md"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            {/* ACTIVITY */}
            <TabsContent value="activity" className="mt-8">
              <Card className="shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-indigo-700">Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.ridesHistory.length > 0 ? (
                    <p className="text-gray-900 font-medium">
                      You've completed <span className="font-semibold text-indigo-700">{profile.ridesHistory.length}</span> rides
                    </p>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <User className="h-16 w-16 mx-auto mb-4" />
                      <p>No ride history yet</p>
                      <p className="text-sm mt-2">Your completed rides will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* UPLOAD PHOTO */}
            <TabsContent value="upload" className="mt-8">
              <Card className="shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-indigo-700">Upload Driver Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="photo">Select Photo</Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-600"
                        onChange={e => {
                          setPhotoFile(e.target.files?.[0] ?? null)
                          setUploadError(null)
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                    <Button 
                      onClick={handleUploadImage} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                      disabled={!photoFile || loading}
                    >
                      {loading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UPLOAD VIDEO */}
            <TabsContent value="uploadVideo" className="mt-8">
              <Card className="shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-indigo-700">Upload Driver Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadVideoError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{uploadVideoError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="video">Select Video</Label>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        className="block w-full text-sm text-gray-600"
                        onChange={e => {
                          setVideoFile(e.target.files?.[0] ?? null)
                          setUploadVideoError(null)
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        Supported formats: MP4, WebM, etc. Max size: 50MB
                      </p>
                    </div>
                    <Button
                      onClick={handleUploadVideo}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                      disabled={!videoFile || loading}
                    >
                      {loading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}