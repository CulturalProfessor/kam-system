const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchRestaurants = async () => {
  const response = await fetch(`${SERVER_URL}/api/restaurants`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }
  return await response.json();
};

export const deleteRestaurant = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/restaurants/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete restaurant");
  }
};

export const fetchInteractions = async () => {
  const response = await fetch(`${SERVER_URL}/api/interactions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch interactions");
  }
  return await response.json();
};

export const deleteInteraction = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/interactions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete interaction");
  }
};

export const fetchContacts = async () => {
  const response = await fetch(`${SERVER_URL}/api/contacts`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }
  return await response.json();
};

export const deleteContact = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/contacts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete contact");
  }
};

export const loginUser = async (formData) => {
  const response = await fetch(`${SERVER_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Error logging in");
  }

  return await response.json();
};

export const registerUser = async (formData) => {
  const response = await fetch(`${SERVER_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Error registering user");
  }

  return await response.json();
};

export const addRoleBasedUser = async (formData) => {
  const response = await fetch(`${SERVER_URL}/api/users/new`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Error adding role based user");
  }

  return await response.json();
};

export const fetchUsersFromCurrentRole = async (currentUser) => {
  const response = await fetch(`${SERVER_URL}/api/users/roles/${currentUser.id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return await response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

export const getUserById = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/users/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
};

export const fetchContactById = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/contacts/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch contact");
  }
  return await response.json();
};

export const fetchAllRestaurants = async () => {
  const response = await fetch(`${SERVER_URL}/api/restaurants`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }
  return await response.json();
};

export const fetchAllContacts = async () => {
  const response = await fetch(`${SERVER_URL}/api/contacts`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }
  return await response.json();
};

export const fetchInteractionById = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/interactions/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch interaction");
  }
  return await response.json();
};

export const fetchRestaurantById = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/restaurants/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch restaurant");
  }
  return await response.json();
};

export const saveContact = async (contact, isEdit, id) => {
  const url = isEdit
    ? `${SERVER_URL}/api/contacts/${id}`
    : `${SERVER_URL}/api/contacts`;
  const method = isEdit ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(contact),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save contact");
  }
};

export const saveInteraction = async (interaction, isEdit, id) => {
  const url = isEdit
    ? `${SERVER_URL}/api/interactions/${id}`
    : `${SERVER_URL}/api/interactions`;
  const method = isEdit ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(interaction),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save interaction");
  }
};

export const saveRestaurant = async (restaurant, isEdit, id) => {
  const url = isEdit
    ? `${SERVER_URL}/api/restaurants/${id}`
    : `${SERVER_URL}/api/restaurants`;
  const method = isEdit ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(restaurant),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save restaurant");
  }
};
