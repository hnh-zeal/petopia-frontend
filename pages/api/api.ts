import qs from "querystring";

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

export async function updateUserWithToken(token: string, formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
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
  const queryUrl = page && pageSize ? `?page=${page}&pageSize=${pageSize}` : "";

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
    throw new Error("Failed to fetch Doctor");
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
    throw new Error("Failed to update Doctor");
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

export async function fetchPetClinicByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-clinics/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinic");
  }

  return await response.json();
}

export async function createDateSchedule(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment-slots`,
    {
      method: "POST",
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

export async function fetchAppointmentSlots(queryData: any, token?: string) {
  const { doctorId, date, time, status, page, pageSize } = queryData;
  const query = {
    ...(doctorId && { doctorId }),
    ...(date && { date }),
    ...(time && { time }),
    ...(status && { status }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment-slots${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data;
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

export async function createCareService(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await response.json();
  return data;
}

export async function fetchServices(queryData?: any) {
  const { page, pageSize } = queryData;
  const query = {
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services${queryUrl}`,
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

export async function fetchServiceByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service by ID");
  }

  const data = await response.json();
  return data;
}

export async function fetchCafePets(queryData?: any) {
  const { page, pageSize } = queryData;
  const query = {
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cafe-pets${queryUrl}`,
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

export async function fetchRoomSlots(queryData: any) {
  const { roomId, status, date, page, pageSize } = queryData;
  const query = {
    ...(roomId && { roomId }),
    ...(date && { date: date.toISOString() }),
    ...(status && { status }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/room-slots${queryUrl}`,
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

export async function submitBooking(formValues: any, token: string) {
  console.log(formValues);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/room-booking`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchRoomBooking(queryData: any, token: string) {
  const { userId, roomId, status, date, page, pageSize } = queryData;

  const query = {
    ...(userId && { userId }),
    ...(roomId && { roomId }),
    ...(status && { status }),
    ...(page && { page }),
    ...(date && { date: date.toISOString() }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/room-booking${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data;
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

export async function singleFileUpload(fileData: any, token: string) {
  const formData = new FormData();
  formData.append("file", fileData.file);
  formData.append("isPublic", fileData.isPublic);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  // Check for JSON response
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  } else {
    // Handle non-JSON response
    const text = await response.text();
    throw new Error(`Unexpected response format: ${text}`);
  }
}

export async function deleteFile(key: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/delete/${key}`,
    {
      method: "DELETE",
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

export async function fetchClinicAppointments(queryData: any, token?: string) {
  const { userId, doctorId, date, page, pageSize } = queryData;

  const query = {
    ...(userId && { userId }),
    ...(doctorId && { doctorId }),
    ...(date && { date: date.toISOString() }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic-appointments${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch clinic appointments");
  }

  const data = await response.json();
  return data;
}

export async function fetchClinicAppointmentByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic-appointments/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Clinic Appointment By ID");
  }

  return await response.json();
}

export async function updateClinicAppointment(
  id: number,
  formValues: any,
  token: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic-appointments/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update clinic appointment!");
  }

  const data = await response.json();
  return data;
}

export async function submitAppointment(formValues: any, userToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic-appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit clinic appointments");
  }

  const data = await response.json();
  return data;
}

export async function fetchPackages(queryData: any) {
  const { type, page, pageSize } = queryData;

  const query = {
    ...(type && { type }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch packages");
  }

  const data = await response.json();
  return data;
}
