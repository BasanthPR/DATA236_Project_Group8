// // src/components/CustomerForm.tsx
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { getFieldError } from "src/utils/ValidationUtils";
// import { getFieldError } from "../utils/ValidationUtils";

// import { CustomerProfile } from "@/types/customer";

// interface CustomerFormProps {
//   initialData: Partial<CustomerProfile>;
//   onSubmit: (data: Partial<CustomerProfile>) => Promise<void>;
//   onCancel: () => void;
// }

// const CustomerForm = ({ initialData, onSubmit, onCancel }: CustomerFormProps) => {
//   const [formData, setFormData] = useState<Partial<CustomerProfile>>(initialData);
//   const [errors, setErrors] = useState<Record<string, string | null>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   useEffect(() => {
//     setFormData(initialData);
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Validate field on change
//     const error = getFieldError(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string | null> = {};
//     let isValid = true;

//     // Required fields
//     const requiredFields = ['firstName', 'lastName', 'email'];
//     requiredFields.forEach(field => {
//       if (!formData[field as keyof typeof formData]) {
//         newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
//         isValid = false;
//       }
//     });

//     // Validate fields with specific format requirements
//     const fieldsToValidate = ['ssn', 'state', 'zipCode', 'phoneNumber', 'email'];
//     fieldsToValidate.forEach(field => {
//       const value = formData[field as keyof typeof formData] as string;
//       if (value) {
//         const error = getFieldError(field, value);
//         if (error) {
//           newErrors[field] = error;
//           isValid = false;
//         }
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage(null);

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Form submission error:', error);
//       setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {errorMessage && (
//         <Alert variant="destructive">
//           <AlertDescription>{errorMessage}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* SSN */}
//         <div className="space-y-2">
//           <Label htmlFor="ssn">Customer ID (SSN)</Label>
//           <Input
//             id="ssn"
//             name="ssn"
//             value={formData.id || ''}
//             onChange={handleChange}
//             placeholder="XXX-XX-XXXX"
//             className={errors.ssn ? "border-red-500" : ""}
//           />
//           {errors.ssn && <p className="text-sm text-red-500">{errors.ssn}</p>}
//         </div>
        
//         {/* First Name */}
//         <div className="space-y-2">
//           <Label htmlFor="firstName">First Name *</Label>
//           <Input
//             id="firstName"
//             name="firstName"
//             value={formData.firstName || ''}
//             onChange={handleChange}
//             required
//             className={errors.firstName ? "border-red-500" : ""}
//           />
//           {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
//         </div>
        
//         {/* Last Name */}
//         <div className="space-y-2">
//           <Label htmlFor="lastName">Last Name *</Label>
//           <Input
//             id="lastName"
//             name="lastName"
//             value={formData.lastName || ''}
//             onChange={handleChange}
//             required
//             className={errors.lastName ? "border-red-500" : ""}
//           />
//           {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
//         </div>
        
//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="email">Email *</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             required
//             className={errors.email ? "border-red-500" : ""}
//           />
//           {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//         </div>
        
//         {/* Phone */}
//         <div className="space-y-2">
//           <Label htmlFor="phoneNumber">Phone Number</Label>
//           <Input
//             id="phoneNumber"
//             name="phoneNumber"
//             value={formData.phoneNumber || ''}
//             onChange={handleChange}
//             placeholder="(555) 123-4567"
//             className={errors.phoneNumber ? "border-red-500" : ""}
//           />
//           {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
//         </div>
        
//         {/* Address */}
//         <div className="space-y-2 md:col-span-2">
//           <Label htmlFor="address">Address</Label>
//           <Input
//             id="address"
//             name="address"
//             value={formData.address || ''}
//             onChange={handleChange}
//           />
//         </div>
        
//         {/* City */}
//         <div className="space-y-2">
//           <Label htmlFor="city">City</Label>
//           <Input
//             id="city"
//             name="city"
//             value={formData.city || ''}
//             onChange={handleChange}
//           />
//         </div>
        
//         {/* State */}
//         <div className="space-y-2">
//           <Label htmlFor="state">State</Label>
//           <Input
//             id="state"
//             name="state"
//             value={formData.state || ''}
//             onChange={handleChange}
//             placeholder="CA or California"
//             className={errors.state ? "border-red-500" : ""}
//           />
//           {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
//         </div>
        
//         {/* Zip Code */}
//         <div className="space-y-2">
//           <Label htmlFor="zipCode">Zip Code</Label>
//           <Input
//             id="zipCode"
//             name="zipCode"
//             value={formData.zipCode || ''}
//             onChange={handleChange}
//             placeholder="12345 or 12345-6789"
//             className={errors.zipCode ? "border-red-500" : ""}
//           />
//           {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
//         </div>
//       </div>
      
//       <div className="flex justify-end space-x-4 pt-4">
//         <Button 
//           type="button" 
//           variant="outline" 
//           onClick={onCancel}
//         >
//           Cancel
//         </Button>
//         <Button 
//           type="submit" 
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Saving..." : "Save Changes"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default CustomerForm;

// src/components/CustomerForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFieldError } from "@/utils/ValidationUtils";
import { CustomerProfile } from "@/types/customer";

interface CustomerFormProps {
  initialData: Partial<CustomerProfile>;
  onSubmit: (data: Partial<CustomerProfile>) => Promise<void>;
  onCancel: () => void;
}

const CustomerForm = ({ initialData = {}, onSubmit, onCancel }: CustomerFormProps) => {
  // Initialize with empty object if initialData is undefined
  const [formData, setFormData] = useState<Partial<CustomerProfile>>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phoneNumber: initialData.phoneNumber || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only update if initialData has values
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change
    const error = getFieldError(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    // Required fields
    const requiredFields = ['firstName', 'lastName'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    // Validate fields with specific format requirements
    const fieldsToValidate = ['state', 'zipCode', 'phoneNumber'];
    fieldsToValidate.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      if (value) {
        const error = getFieldError(field, value);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if email exists to determine if it should be readonly
  const hasEmail = !!initialData.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            required
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>
        
        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            required
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            readOnly={true} // Always make email readonly
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500 italic">Email cannot be changed</p>
        </div>
        
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
        </div>
        
        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
          />
        </div>
        
        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
          />
        </div>
        
        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            placeholder="CA or California"
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>
        
        {/* Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleChange}
            placeholder="12345 or 12345-6789"
            className={errors.zipCode ? "border-red-500" : ""}
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;