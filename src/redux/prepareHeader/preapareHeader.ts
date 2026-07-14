
export const prepareHeaders = (
    headers: Headers,
    { getState }: { getState: () => unknown }
) => {
    const state = getState() as any;
    const stateToken = state?.user?.token;

    let user = localStorage.getItem("user") as string | null;
    let storageToken = user ? JSON.parse(user)?.token : null;

    // Fallback to token inside stored user object when `token` key is absent.
    if (!storageToken) {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                storageToken = JSON.parse(storedUser)?.token || null;
            }
        } catch {
            storageToken = null;
        }
    }

    const token = stateToken || storageToken;

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
};