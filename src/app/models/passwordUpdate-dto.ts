export interface PasswordUpdateRequest {
    oldPassword: string; // Mandatory (matches Java field name)
    newPassword: string; // Mandatory (matches Java field name)
}