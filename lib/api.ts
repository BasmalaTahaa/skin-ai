const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/* ================= AUTH ================= */

// ---------- SIGNUP ----------
export async function signup(data: {
  email: string;
  password: string;
  full_name: string;
}) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Signup failed");
  }

  return res.json();
}

// ---------- LOGIN (IMPORTANT FIX) ----------
export async function login(data: {
  email: string;
  password: string;
}) {
  // OAuth2PasswordRequestForm يحتاج x-www-form-urlencoded
  const form = new URLSearchParams();
  form.append("username", data.email); // 👈 email = username
  form.append("password", data.password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json(); // { access_token, token_type }
}

/* ================= PROFILE ================= */

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Get profile failed");
  }

  return res.json();
}

/* ================= ANALYZE ================= */

export async function analyzeSkin(
  file: File,
  token: string,
  userMessage?: string
) {
  const formData = new FormData();
  formData.append("file", file);

  if (userMessage && userMessage.trim().length > 0) {
    formData.append("user_message", userMessage);
  }

  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // 🔑 لازم التوكن
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Analyze failed");
  }

  return res.json();
}

/* ================= CHAT ================= */

export async function chat(
  data: {
    message?: string;
    prediction: string;
    confidence: number;
    mode: "auto" | "user";
  },
  token: string
) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔑 لازم التوكن
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Chat failed");
  }

  return res.json();
}
