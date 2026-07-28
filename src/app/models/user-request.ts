export interface UserRequest {
  name: string;          // Changed from username to name
  email: string;         // Mandatory
  contactNumber: string; // Mandatory (matches Java field name)
  password: string;      // Mandatory (min 6 chars in Java)
  role: string;          // Changed from roles (array) to role (string)
}