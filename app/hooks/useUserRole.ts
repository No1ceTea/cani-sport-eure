import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';

export default function useUserRole() {
  const [role, setRole] = useState<'admin' | 'adherent' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        const metadata = user.user_metadata;

        if (metadata?.administrateur) {
          setRole('admin');
        } else if (metadata?.statut_inscription === 'inscrit') {
          setRole('adherent');
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setIsLoading(false);
    };

    getUser();
  }, []);

  return { role, isLoading };
}
