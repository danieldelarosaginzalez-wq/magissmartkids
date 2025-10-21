# Implementation Plan

- [x] 1. Add institution state management to Register component





  - Add institutions array state to store fetched institution data
  - Add loading state for institution fetching process
  - Add error state for institution loading failures
  - Add institutionId field to RegisterFormData interface
  - _Requirements: 1.1, 1.2, 4.1_

- [x] 2. Implement institution data fetching functionality





  - Create loadInstitutions async function using existing institutionApi.getAll()
  - Add useEffect hook to load institutions when component mounts
  - Implement error handling for network failures and empty responses
  - Add retry mechanism for failed institution requests
  - _Requirements: 1.1, 4.2, 4.3, 4.4_

- [x] 3. Create institution selection dropdown UI component





  - Add institution select field with proper styling matching existing form fields
  - Implement conditional rendering based on user role (show for STUDENT, TEACHER, COORDINATOR, PARENT)
  - Add default "Selecciona tu institución" option
  - Display institution names as option text with institution IDs as values
  - Add loading indicator during institution fetch
  - _Requirements: 1.2, 1.3, 1.4, 2.1, 3.1, 4.1_

- [ ] 4. Implement form validation for institution selection



  - Add validation logic to make institution required for STUDENT, TEACHER, COORDINATOR roles
  - Make institution optional for PARENT role
  - Add validation error messages for missing required institution selection
  - Prevent form submission when required institution is not selected
  - _Requirements: 1.5, 2.1, 2.2, 2.3, 3.2_
-

- [ ] 5. Update registration form submission to include institution data


  - Modify form submission handler to include institutionId in registration payload
  - Ensure institutionId is only included when an institution is selected
  - Verify registration request matches backend RegisterRequest.java expectations
  - _Requirements: 2.4, 3.3, 5.1, 5.2_

- [ ] 6. Add error handling and user feedback for institution functionality



  - Display appropriate error messages for institution loading failures
  - Show loading states during institution fetch operations
  - Add user-friendly messages for empty institution lists
  - Implement error recovery mechanisms
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
-

- [ ] 7. Write unit tests for institution selection functionality


  - Test institution data fetching and state management
  - Test conditional rendering based on user roles
  - Test form validation with and without institution selection
  - Test error handling scenarios
  - _Requirements: 1.1, 2.1, 4.2_

- [ ] 8. Write integration tests for complete registration flow




  - Test end-to-end registration with institution selection
  - Test API integration and data transformation
  - Test form submission includes correct institution data
  - _Requirements: 5.1, 5.2, 5.3_