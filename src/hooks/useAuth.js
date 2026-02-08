import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try {
                // 1. Ver sesión activa
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session && isMounted) {
                    // 2. Intentar traer perfil
                    const { data, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle(); // Usamos maybeSingle para que no explote si no hay perfil

                    if (isMounted) setProfile(data || null);
                }
            } catch (err) {
                console.error("Error en Auth:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                checkUser();
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    return { profile, loading };
}