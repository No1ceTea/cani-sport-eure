"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/SidebarAdmin";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  administrateur: boolean;
  statut_inscription: "en attente" | "inscrit" | "refusé";
}

export default function ListeAdherents() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

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

  async function updateStatus(id: string, statut: "inscrit" | "refusé") {
    const confirmation = window.confirm(
      `Êtes-vous sûr de vouloir ${statut === "inscrit" ? "confirmer" : "rejeter"} cet utilisateur ?`
    );
    if (!confirmation) return;

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut_inscription: statut }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, statut_inscription: statut } : user
        )
      );
      alert(`Utilisateur ${statut === "inscrit" ? "confirmé" : "rejeté"} avec succès !`);
    } else {
      alert("Erreur lors de la mise à jour. Veuillez réessayer.");
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
              <th>Email</th>
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
                  <td>{user.email}</td>
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
                    {user.statut_inscription === "en attente" ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateStatus(user.id, "inscrit")}
                        >
                          Confirmer
                        </button>
                        <button
                          className="btn btn-error"
                          onClick={() => updateStatus(user.id, "refusé")}
                        >
                          Rejeter
                        </button>
                      </>
                    ) : null}
                    <button className="btn btn-outline">👁️</button>
                    <button className="btn btn-outline">✏️</button>
                    <button className="btn btn-outline">🗑️</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
