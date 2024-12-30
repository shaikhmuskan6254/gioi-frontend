export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch("/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data.user; // Return user profile
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
