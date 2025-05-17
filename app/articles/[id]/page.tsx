"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React pour l'état et les effets
import { useParams } from "next/navigation"; // Hook pour accéder aux paramètres d'URL
import supabase from "../../../lib/supabaseClient"; // Client Supabase pour la base de données
import { formatDistanceToNow } from "date-fns"; // Fonction pour calculer le temps relatif
import { fr } from "date-fns/locale"; // Localisation française pour les dates
import WhiteBackground from "@/app/components/backgrounds/WhiteBackground"; // Composant pour le fond blanc
import Footer from "@/app/components/sidebars/Footer"; // Composant de pied de page
import Sidebar from "@/app/components/sidebars/Sidebar"; // Barre latérale de navigation

// Interface définissant la structure d'un article
interface Article {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  created_at: string;
  id_profil: string;
}

// Interface définissant la structure d'un auteur
interface Author {
  nom: string;
  prenom: string;
  photo_profil: string | null; // Peut être null
}

const ArticleDetail = () => {
  const { id } = useParams() as { id: string }; // Récupération de l'ID depuis l'URL
  const [article, setArticle] = useState<Article | null>(null); // État pour l'article
  const [author, setAuthor] = useState<Author | null>(null); // État pour l'auteur

  // Effet pour charger les données de l'article et de l'auteur
  useEffect(() => {
    // Fonction pour récupérer l'article par son ID
    const fetchArticle = async () => {
      if (!id) return;

      // Requête à Supabase pour récupérer l'article
      const { data, error } = await supabase
        .from("publication")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      } else {
        setArticle(data as Article); // Mise à jour de l'état article
        fetchAuthor(data.id_profil); // Chargement des données de l'auteur
      }
    };

    // Fonction pour récupérer les informations de l'auteur
    const fetchAuthor = async (authorId: string) => {
      const { data, error } = await supabase
        .from("profils") // Table des profils utilisateurs
        .select("nom, prenom, photo_profil")
        .eq("id", authorId)
        .single();

      if (!error) setAuthor(data); // Mise à jour de l'état auteur
    };

    fetchArticle(); // Exécution du chargement de l'article
  }, [id]); // Rechargement si l'ID change

  // Affichage d'un message de chargement si l'article n'est pas encore disponible
  if (!article) return <p>Chargement...</p>;

  // Calcul du temps écoulé depuis la publication (ex: "il y a 2 jours")
  const timeAgo = formatDistanceToNow(new Date(article.created_at), { locale: fr, addSuffix: true });

  return (
    <div>
      <WhiteBackground> {/* Conteneur avec fond blanc */}
        <Sidebar /> {/* Barre latérale de navigation */}
        <div className="min-h-screen px-10 py-6">
          {/* Titre principal de la page */}
          <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Articles</h1>

          {/* Carte contenant l'article */}
          <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-lg flex flex-col md:flex-row items-left gap-6 max-w-6xl mx-auto border-black border-2 max-h-[800px] overflow-hidden">
            
            {/* Partie gauche : Texte avec défilement */}
            <div className="flex-1 flex flex-col max-h-[700px] overflow-y-auto p-4">
              {/* Bloc auteur avec avatar */}
              <div className="flex gap-3 mb-4 items-center">
                <img
                  src={author?.photo_profil || "/default-avatar.png"} // Avatar avec image par défaut
                  alt={author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold">{author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}</p>
                  <p className="text-sm text-gray-300">{timeAgo}</p> {/* Temps écoulé */}
                </div>
              </div>

              {/* Contenu de l'article */}
              <h2 className="text-xl font-bold">{article.titre}</h2> {/* Titre de l'article */}
              <p className="mt-2 text-gray-200 whitespace-pre-line">{article.contenu}</p> {/* Contenu avec préservation des sauts de ligne */}

              {/* Date de création formatée */}
              <p className="mt-4 text-sm text-gray-300">
                Créé le {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Partie droite : Image fixe */}
            <div className="w-64 h-64 flex-shrink-0">
              <img src={article.image_url} alt={article.titre} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </WhiteBackground> 
      <Footer /> {/* Pied de page */}
    </div>
  );
};

export default ArticleDetail;
