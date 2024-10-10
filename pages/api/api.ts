import { format } from "date-fns";
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

  const data = await response.json();
  return data;
}

export async function updateDoctorScheduleByID(id: number, values: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor-schedules/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

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

export async function createRoomSlots(formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/room-slots`,
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

export async function fetchPetSitters(queryData: any, token?: string) {
  const { sitterId, date, time, status, page, pageSize } = queryData;
  const query = {
    ...(sitterId && { sitterId }),
    ...(date && { date }),
    ...(time && { time }),
    ...(status && { status }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";

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

  return await response.json();
}

export async function createPetSitter(formValues: any, adminToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  return await response.json();
}

export async function fetchPetSitterByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await response.json();
}

export async function updatePetSitterByID(id: number, formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );
  const data = await response.json();
  return data;
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

  const data = await response.json();
  return data;
}

export async function updateCareService(id: number, formValues: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

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

  return await response.json();
}

export async function fetchRoomSlots(queryData: any) {
  console.log(queryData);
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

export async function fetchRoomBooking(queryData: any, token?: string) {
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
        // Authorization: `Bearer ${token}`,
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

  const data = await response.json();
  return data;
}

export async function submitCareAppointment(
  formValues: any,
  userToken: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

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

  const data = await response.json();
  return data;
}

export async function fetchPackageByID(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function createPackages(formValues: any, adminToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(formValues),
  });

  const data = await response.json();
  return data;
}

export async function editPackageByID(
  id: number,
  formValues: any,
  adminToken: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  const data = await response.json();
  return data;
}

export async function purchasePackage(formValues: any, userToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages/${formValues.packageId}/purchase`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchCategories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function createCareAppointment(
  formValues: any,
  userToken: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(formValues),
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchCareAppointments(queryData: any, token?: string) {
  const { userId, date, page, pageSize } = queryData;

  const query = {
    ...(userId && { userId }),
    ...(date && { date: date.toISOString() }),
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-appointments${queryUrl}`,
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

export async function fetchDiscountPackage(queryData: any, token: string) {
  const { type } = queryData;

  const query = {
    ...(type && { type }),
  };

  const queryString = qs.stringify(query);
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/packages/active${queryUrl}`,
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

export async function fetchOverviewReport(queryData: any, adminToken?: string) {
  const { date } = queryData;
  const queryString = qs.stringify({ date: format(date, "yyyy-MM-dd") });
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard/overview${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchPieData(queryData: any, adminToken?: string) {
  const queryString = qs.stringify(queryData);
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard/pie-data${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchClinicReport(queryData: any, adminToken: string) {
  const { date_from, date_to } = queryData;

  const queryString = qs.stringify({
    date_from: format(date_from, "yyyy-MM-dd"),
    date_to: format(date_to, "yyyy-MM-dd"),
  });
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/pet-clinics${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchCareReport(queryData: any, adminToken: string) {
  const { date_from, date_to } = queryData;

  const queryString = qs.stringify({
    date_from: format(date_from, "yyyy-MM-dd"),
    date_to: format(date_to, "yyyy-MM-dd"),
  });
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/pet-care${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function fetchCafeReport(queryData: any, adminToken: string) {
  const { date_from, date_to } = queryData;

  const queryString = qs.stringify({
    date_from: format(date_from, "yyyy-MM-dd"),
    date_to: format(date_to, "yyyy-MM-dd"),
  });
  const queryUrl = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reports/pet-cafe${queryUrl}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    }
  );

  const data = await response.json();
  return data;
}
