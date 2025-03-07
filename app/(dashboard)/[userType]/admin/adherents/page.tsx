"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "../../../../components/SidebarAdmin";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  license_number: string;
  administrateur: boolean;
  statut_inscription: "en attente" | "inscrit" | "refusé";
}

export default function ListeAdherents() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    }
    fetchUsers();
  }, []);

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un adhérent"
            className="input input-bordered w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table w-full">
          <thead>
            <tr>
              <th>Nom Prénom</th>
              <th>Naissance</th>
              <th>Licence</th>
              <th>Rôle</th>
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
                    <button className="btn btn-secondary" onClick={() => setSelectedUser(user)}>
                      Modifier
                    </button>
                    <button className="btn btn-error" onClick={() => deleteUser(user.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE MODIFICATION */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Modifier l&apos;utilisateur</h2>

            {/* Nom */}
            <h2 className="text-l font-bold mb-2">Nom :</h2>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.last_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, last_name: e.target.value })
              }
            />

            {/* Prénom */}
            <h2 className="text-l font-bold mb-2">Prénom :</h2>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.first_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, first_name: e.target.value })
              }
            />

            {/* Email */}
            <h2 className="text-l font-bold mb-2">Email :</h2>
            <input
              type="email"
              className="input input-bordered w-full mb-2"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />

            {/* Date de naissance */}
            <h2 className="text-l font-bold mb-2">Date de naissance :</h2>
            <input
              type="date"
              className="input input-bordered w-full mb-2"
              value={selectedUser.birthdate}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, birthdate: e.target.value })
              }
            />

            {/* Numéro de licence */}
            <h2 className="text-l font-bold mb-2">Numéro de licence :</h2>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={selectedUser.license_number}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, license_number: e.target.value })
              }
            />

            {/* Administrateur (checkbox) */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selectedUser.administrateur}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, administrateur: e.target.checked })
                }
              />
              <label className="text-l font-bold">Administrateur</label>
            </div>

            {/* Statut d'inscription (select) */}
            <h2 className="text-l font-bold mb-2">Statut d&apos;inscription :</h2>
            <select
              className="select select-bordered w-full mb-2"
              value={selectedUser.statut_inscription}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, statut_inscription: e.target.value as User["statut_inscription"] })
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
