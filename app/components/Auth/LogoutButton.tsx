import supabase from '@/lib/supabaseClient';

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/connexion';
  };

  return <div className='hover:text-yellow_primary'><button onClick={handleLogout}>Se déconnecter</button></div>;
}
