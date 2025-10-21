# Requirements Document

## Introduction

The registration form currently lacks an institution selection dropdown for users who need to be associated with an educational institution. While the backend already has an institutions table and API endpoint, the frontend form does not provide a way for users to select their institution during registration, which is critical for proper user registration and system functionality.

## Glossary

- **Institution_Selection_System**: The frontend component that displays available institutions in a dropdown format
- **Institution_API**: The backend endpoint `/api/institutions` that returns active institutions
- **Registration_Form**: The user interface form where users create their accounts
- **Institution_Entity**: A database record representing an educational institution with id, name, and other properties
- **User_Registration_Process**: The complete flow from form submission to user account creation

## Requirements

### Requirement 1

**User Story:** As a user registering on the platform, I want to see a dropdown list of available institutions, so that I can select my institution during registration.

#### Acceptance Criteria

1. WHEN the Registration_Form loads, THE Institution_Selection_System SHALL fetch all active institutions from the Institution_API
2. THE Institution_Selection_System SHALL display institutions in a select dropdown with "Selecciona tu institución" as the default option
3. WHEN an institution is selected, THE Institution_Selection_System SHALL store the institution ID as the form value
4. THE Institution_Selection_System SHALL display the institution name as the visible text in each option
5. THE Institution_Selection_System SHALL be a required field that prevents form submission if no institution is selected

### Requirement 2

**User Story:** As a student, teacher, or coordinator, I want the institution field to be mandatory, so that I am properly associated with my educational institution.

#### Acceptance Criteria

1. WHEN a user selects "STUDENT", "TEACHER", or "COORDINATOR" role, THE Registration_Form SHALL display the Institution_Selection_System as a required field
2. WHEN the form is submitted without an institution selection, THE Registration_Form SHALL display a validation error message
3. THE Registration_Form SHALL prevent submission until a valid institution is selected
4. WHEN the form is submitted with a valid institution, THE User_Registration_Process SHALL include the institution_id in the registration data

### Requirement 3

**User Story:** As a parent user, I want the institution field to be optional, so that I can register without being directly associated with an institution.

#### Acceptance Criteria

1. WHEN a user selects "PARENT" role, THE Institution_Selection_System SHALL be displayed as an optional field
2. THE Registration_Form SHALL allow form submission for parents without institution selection
3. WHEN a parent selects an institution, THE User_Registration_Process SHALL include the institution_id in the registration data
4. WHEN a parent does not select an institution, THE User_Registration_Process SHALL proceed with null institution_id

### Requirement 4

**User Story:** As a user, I want to see loading states and error handling for the institution dropdown, so that I understand when data is being fetched or if there are connection issues.

#### Acceptance Criteria

1. WHILE institutions are being fetched, THE Institution_Selection_System SHALL display a loading indicator
2. WHEN the Institution_API request fails, THE Institution_Selection_System SHALL display an error message
3. WHEN no institutions are returned, THE Institution_Selection_System SHALL display an appropriate message
4. THE Institution_Selection_System SHALL provide a retry mechanism if the initial request fails

### Requirement 5

**User Story:** As a system administrator, I want the registration process to properly save the institution association, so that users are correctly linked to their institutions in the database.

#### Acceptance Criteria

1. WHEN the registration form is submitted with an institution selection, THE User_Registration_Process SHALL include the institutionId field in the API request
2. THE User_Registration_Process SHALL validate that the provided institution ID exists and is active
3. WHEN the registration is successful, THE User_Registration_Process SHALL create the user record with the correct institution association
4. THE User_Registration_Process SHALL return appropriate error messages if the institution validation fails