package com.lms.backend.service;

import com.lms.backend.dto.PasswordChangeRequest;
import com.lms.backend.dto.ProfileResponse;
import com.lms.backend.dto.ProfileUpdateRequest;

public interface UserService {
    ProfileResponse getProfile(Long userId);
    ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request);
    void changePassword(Long userId, PasswordChangeRequest request);
    
    java.util.List<ProfileResponse> getAllUsers();
    void updateUserRole(Long targetUserId, String newRole);
}
