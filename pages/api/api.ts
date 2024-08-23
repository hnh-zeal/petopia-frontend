export async function adminLogin(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function userLogin(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function userRegister(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch User");
  }

  const data = await response.json();
  return data;
}

export async function forgotPassword(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function sendEmail(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function verifyOTP(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function resetPassword(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function fetchUsers(
  adminToken: string,
  page?: number,
  pageSize?: number
) {
  const queryUrl = page && pageSize ? `?page=${page}&pageSize=${pageSize}` : "";
  // const sortParams = "" || `&sort=[{"orderBy":"name", "order":"desc"}]`;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchUserByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch User");
  }

  const data = await response.json();
  return data;
}

export async function updateUserWithToken(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${data.message}`);
  }

  return data;
}

export async function toggleActiveUser(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/toggle-active`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update User");
  }

  const data = await response.json();
  return data;
}

export async function fetchDoctors(
  page?: number,
  pageSize?: number,
  adminToken?: string
) {
  const queryUrl = `?page=${page}&pageSize=${pageSize}`;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  const data = await response.json();
  return data;
}

export async function fetchDoctorByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinics");
  }

  const data = await response.json();
  return data;
}

export async function updateDoctorByID(id: number, formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinics");
  }

  const data = await response.json();
  return data;
}

export async function fetchPetClinics(page?: number, pageSize?: number) {
  const queryUrl = page && pageSize ? `?page=${page}&pageSize=${pageSize}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-clinics${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinics");
  }

  return await response.json();
}

export async function fetchPetSitters(
  page?: number,
  pageSize?: number,
  token?: string
) {
  const queryUrl = page && pageSize ? `?page=${page}&pageSize=${pageSize}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinics");
  }

  return await response.json();
}

export async function fetServices(page: number, pageSize: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await response.json();
  return data;
}

export async function fetchCafePets(page?: number, pageSize?: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cafe-pets?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Cafe Pets");
  }

  return await response.json();
}

export async function fetchCafeRooms(
  page?: number,
  pageSize?: number,
  adminToken?: string
) {
  const queryUrl = page && pageSize ? `?page=${page}&pageSize=${pageSize}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rooms${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchCafeRoomByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function updateCafeRoomByID(id: number, formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );
  const data = await response.json();
  return data;
}

export async function createCafeRoom(formValues: any, adminToken?: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(formValues),
  });

  const data = await response.json();
  return data;
}

export async function fetchCafePetByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cafe-pets/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Cafe Pets");
  }

  return await response.json();
}

export async function updateCafePetByID(id: number, formValues: any) {
  console.log(formValues);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cafe-pets/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to Update Pets");
  }

  return await response.json();
}

export async function fetchAdminWithToken(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${data.message}`);
  }

  return data;
}

export async function fetchUserWithToken(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${data.message}`);
  }

  return data;
}
