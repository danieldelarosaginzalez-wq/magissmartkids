# Design Document

## Overview

This design implements an institution selection dropdown in the registration form that allows users to select their educational institution during account creation. The solution leverages the existing backend infrastructure (`/api/institutions` endpoint) and integrates seamlessly with the current registration flow.

## Architecture

The implementation follows a client-server architecture where:

1. **Frontend**: React component with state management for institution data and form validation
2. **Backend**: Existing Spring Boot API endpoint that serves active institutions
3. **Data Flow**: Fetch institutions on component mount → Display in dropdown → Include selected institution ID in registration payload

## Components and Interfaces

### 1. Institution Selection Component

**Location**: Integrated within existing `Register.tsx` component

**State Management**:
```typescript
interface Institution {
  id: number;
  name: string;
  nit: string;
  address: string;
  isActive: boolean;
}

// Additional state in Register component
const [institutions, setInstitutions] = useState<Institution[]>([]);
const [loadingInstitutions, setLoadingInstitutions] = useState(false);
const [institutionError, setInstitutionError] = useState('');
```

**Form Data Extension**:
```typescript
interface RegisterFormData {
  // ... existing fields
  institutionId?: number; // New field for institution selection
}
```

### 2. API Integration

**Existing Endpoint**: `/api/institutions` (GET)
- Already implemented in `InstitutionController.java`
- Returns active institutions with success/error response format
- Public endpoint (no authentication required)

**Frontend Service**: `institutionApi.getAll()` 
- Already implemented in `api.ts`
- Uses `publicApi` instance for unauthenticated requests

### 3. UI Components

**Institution Dropdown**:
- HTML `<select>` element with Tailwind CSS styling
- Consistent with existing form field styling
- Loading state with spinner indicator
- Error state with error message display

**Conditional Rendering Logic**:
- Required for: STUDENT, TEACHER, COORDINATOR roles
- Optional for: PARENT role
- Hidden for: Other roles (if any)

## Data Models

### Institution Entity (Backend)
```java
public class Institution {
    private Long id;
    private String name;
    private String nit;
    private String address;
    private String phone;
    private String email;
    private Boolean isActive;
    // ... getters and setters
}
```

### API Response Format
```json
{
  "success": true,
  "message": "Instituciones obtenidas correctamente",
  "institutions": [
    {
      "id": 1,
      "name": "Colegio San José",
      "nit": "123456789",
      "address": "Calle 123 #45-67",
      "isActive": true
    }
  ],
  "total": 1
}
```

### Registration Request Update
```typescript
// RegisterRequest.java already includes institutionId field
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "password": "password123",
  "role": "STUDENT",
  "institutionId": 1, // New field usage
  "gradeLevel": "5°"
}
```

## Error Handling

### Frontend Error States

1. **Network Errors**: Display retry mechanism with user-friendly message
2. **Empty Response**: Show "No hay instituciones disponibles" message
3. **Loading Timeout**: Implement timeout with retry option
4. **Validation Errors**: Prevent form submission with clear error messages

### Error Messages
- Loading: "Cargando instituciones..."
- Network Error: "Error al cargar instituciones. Verifica tu conexión."
- Empty Data: "No hay instituciones disponibles en este momento."
- Validation: "Debes seleccionar una institución para continuar."

### Backend Error Handling
- Existing error handling in `InstitutionController.java` is sufficient
- Returns structured error responses with success/message format

## Testing Strategy

### Unit Tests
- Test institution data fetching and state management
- Test form validation with and without institution selection
- Test conditional rendering based on user role
- Test error handling scenarios

### Integration Tests
- Test complete registration flow with institution selection
- Test API integration and data transformation
- Test form submission with institution ID included

### User Acceptance Tests
- Verify dropdown appears for required roles
- Verify dropdown is optional for parent role
- Verify form validation prevents submission without required institution
- Verify successful registration includes institution association

## Implementation Details

### 1. Institution Loading Logic
```typescript
const loadInstitutions = async () => {
  setLoadingInstitutions(true);
  setInstitutionError('');
  
  try {
    const response = await institutionApi.getAll();
    if (response.data.success && response.data.institutions) {
      setInstitutions(response.data.institutions);
    } else {
      setInstitutionError('No se pudieron cargar las instituciones');
    }
  } catch (error) {
    setInstitutionError('Error de conexión al cargar instituciones');
  } finally {
    setLoadingInstitutions(false);
  }
};
```

### 2. Conditional Rendering
```typescript
const shouldShowInstitutionField = () => {
  return ['STUDENT', 'TEACHER', 'COORDINATOR', 'PARENT'].includes(formData.role);
};

const isInstitutionRequired = () => {
  return ['STUDENT', 'TEACHER', 'COORDINATOR'].includes(formData.role);
};
```

### 3. Form Validation Update
```typescript
// Add to existing validation logic
if (isInstitutionRequired() && !formData.institutionId) {
  setError('Debes seleccionar una institución');
  return;
}
```

### 4. Registration Payload Update
```typescript
const registerData = {
  // ... existing fields
  ...(formData.institutionId && { institutionId: formData.institutionId })
};
```

## Performance Considerations

1. **Lazy Loading**: Institutions are loaded only when the registration form mounts
2. **Caching**: Consider implementing client-side caching for institutions data
3. **Debouncing**: Not needed for dropdown selection (immediate response)
4. **Error Recovery**: Implement retry mechanism for failed requests

## Security Considerations

1. **Input Validation**: Validate institution ID exists and is active on backend
2. **Public Endpoint**: Institution list endpoint is appropriately public for registration
3. **Data Sanitization**: Institution data is already sanitized by backend
4. **CORS**: Existing CORS configuration supports the institution endpoint

## Migration Strategy

1. **Backward Compatibility**: Existing registration flow continues to work
2. **Gradual Rollout**: Institution field can be made optional initially
3. **Data Migration**: No database changes required (institutionId field already exists)
4. **Testing**: Comprehensive testing before enabling required validation

## Future Enhancements

1. **Institution Search**: Add search/filter functionality for large institution lists
2. **Institution Creation**: Allow users to request new institution creation during registration
3. **Institution Validation**: Add real-time validation of institution status
4. **Geolocation**: Sort institutions by proximity to user location