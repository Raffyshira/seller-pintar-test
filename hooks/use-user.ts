// hooks/useUser.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useUser() {
    const [user, setUser] = useState<{ username: string; role: string; id: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/auth/me', { withCredentials: true })
            .then((res) => {
                console.log('API /me response:', res.data);
                setUser(res.data.user)
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
