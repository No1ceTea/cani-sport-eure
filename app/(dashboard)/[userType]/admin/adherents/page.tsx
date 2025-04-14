"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { useRouter } from "next/navigation";
import SidebarAdmin from "../../../../components/SidebarAdmin";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalConfirm from "@/app/components/ModalConfirm";
import { FaSearch } from "react-icons/fa";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  license_number: string;
  administrateur: boolean;
  comptable: boolean;
  statut_inscription: "en attente" | "inscrit" | "refusé";
}

export default function ListeAdherents() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  // 🔐 Redirection si non-admin
  useEffect(() => {
    if (!isLoading && (!user || role !== "admin")) {
      router.replace("/connexion");
    }
  }, [user, role, isLoading, router]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    }

    if (user && role === "admin") {
      fetchUsers();
    }
  }, [user, role]);

  async function saveUserEdits() {
    if (!selectedUser) return;

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUser),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      alert("Utilisateur mis à jour avec succès !");
      setSelectedUser(null);
    } else {
      alert("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  }

  function openDeleteModal(user: User) {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }

  async function deleteUserConfirmed() {
    if (!userToDelete) return;
  
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userToDelete.id }),
    });
  
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      alert("Utilisateur supprimé avec succès !");
    } else {
      const errorData = await res.json();
      alert("Erreur lors de la suppression : " + errorData.error);
    }
  
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  }
  
  
  async function deleteUser(userId: string) {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmation) return;

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      alert("Utilisateur supprimé avec succès !");
    } else {
      const errorData = await res.json();
      alert("Erreur lors de la suppression : " + errorData.error);
    }
  }

  if (isLoading || !user || role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />

      <div className="flex-1 p-6 py-16">
        <div className="relative w-full flex justify-left mb-6">
          <input
            type="text"
            placeholder="Rechercher un adhérent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-base sm:text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900 text-base sm:text-lg" />
        </div>

        <div className="grid grid-cols-1gap-4 max-h-[85vh] overflow-y-auto p-2">
        <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nom Prénom</th>
              <th>Naissance</th>
              <th>Licence</th>
              <th>Rôle</th>
              <th>Comptable</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                `${user.last_name} ${user.first_name}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.last_name} {user.first_name}</td>
                  <td>{user.birthdate || "N/A"}</td>
                  <td>{user.license_number || "N/A"}</td>
                  <td>{user.administrateur ? "Admin" : "Adhérent"}</td>
                  <td>{user.comptable ? "Oui" : "Non"}</td>
                  <td>
                    {user.statut_inscription === "inscrit" ? (
                      <span className="badge badge-success">Inscrit</span>
                    ) : user.statut_inscription === "refusé" ? (
                      <span className="badge badge-error">Refusé</span>
                    ) : (
                      <span className="badge badge-warning">En attente</span>
                    )}
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setSelectedUser(user)}
                      title="Modifier"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDeleteModal(user)}
                      title="Supprimer"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
        </div>
      </div>

      <ModalConfirm
        isOpen={isDeleteModalOpen}
        title="Confirmation de suppression"
        message={`Voulez-vous vraiment supprimer ${userToDelete?.first_name} ${userToDelete?.last_name} ?`}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={deleteUserConfirmed}
      />

      {/* MODAL DE MODIFICATION */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Modifier l&apos;utilisateur</h2>

            <label className="block mb-2 font-bold">Nom :</label>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.last_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, last_name: e.target.value })
              }
            />

            <label className="block mb-2 font-bold">Prénom :</label>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.first_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, first_name: e.target.value })
              }
            />

            <label className="block mb-2 font-bold">Email :</label>
            <input
              type="email"
              className="input input-bordered w-full mb-2"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            <label className="block mb-2 font-bold">Date de naissance :</label>
            <input
              type="date"
              className="input input-bordered w-full mb-2"
              value={selectedUser.birthdate}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, birthdate: e.target.value })
              }
            />

            <label className="block mb-2 font-bold">Numéro de licence :</label>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.license_number}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, license_number: e.target.value })
              }
            />

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selectedUser.administrateur}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, administrateur: e.target.checked })
                }
              />
              <label className="font-bold">Administrateur</label>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selectedUser.comptable}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    comptable: e.target.checked
                  })
                }
              />
              <label className="font-bold">Comptabilité</label>
            </div>

            <label className="block mb-2 font-bold">Statut d&apos;inscription :</label>
            <select
              className="select select-bordered w-full mb-2"
              value={selectedUser.statut_inscription}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  statut_inscription: e.target.value as User["statut_inscription"],
                })
              }
            >
              <option value="en attente">En attente</option>
              <option value="inscrit">Inscrit</option>
              <option value="refusé">Refusé</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={saveUserEdits}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
