"use client";

import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import useUserRole from '@/app/hooks/useUserRole';

type RoleGuardProps = {
  allowedRoles: ('admin' | 'adherent')[];
  children: ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && !allowedRoles.includes(role)) {
      router.push('/connexion'); // ou /unauthorized
    }
  }, [role, isLoading]);

  if (isLoading || (role && !allowedRoles.includes(role))) {
    return <p>Chargement...</p>;
  }

  return <>{children}</>;
}
