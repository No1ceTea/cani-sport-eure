"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale"; // Import pour afficher la date en français
import WhiteBackground from "@/app/components/backgrounds/WhiteBackground";
import Footer from "@/app/components/sidebars/Footer";
import Sidebar from "@/app/components/sidebars/Sidebar";

interface Article {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  created_at: string;
  id_profil: string;
}

interface Author {
  nom: string;
  prenom: string;
  photo_profil: string | null; // Peut être null
}

const ArticleDetail = () => {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("publication")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      } else {
        setArticle(data as Article);
        fetchAuthor(data.id_profil);
      }
    };

    const fetchAuthor = async (authorId: string) => {
      const { data, error } = await supabase
        .from("profils") // Table correcte
        .select("nom, prenom, photo_profil")
        .eq("id", authorId)
        .single();

      if (!error) setAuthor(data);
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p>Chargement...</p>;

  // ✅ Calcul du temps écoulé depuis la publication
  const timeAgo = formatDistanceToNow(new Date(article.created_at), { locale: fr, addSuffix: true });

  return (
    <div>
      <WhiteBackground>
      <Sidebar></Sidebar>
    <div className="min-h-screen px-10 py-6">
      {/* Titre principal */}
      <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Articles</h1>

      {/* Carte contenant l'article */}
      <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-lg flex flex-col md:flex-row items-left gap-6 max-w-6xl mx-auto border-black border-2 max-h-[800px] overflow-hidden">
        
        {/* Partie gauche : Texte avec scroll */}
        <div className="flex-1 flex flex-col max-h-[700px] overflow-y-auto p-4">
          {/* Auteur */}
          <div className="flex gap-3 mb-4 items-center">
            <img
              src={author?.photo_profil || "/default-avatar.png"} // ✅ Utilisation de l'image par défaut
              alt={author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">{author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}</p>
              <p className="text-sm text-gray-300">{timeAgo}</p>
            </div>
          </div>

          {/* Contenu de l'article (scrollable) */}
          <h2 className="text-xl font-bold">{article.titre}</h2>
          <p className="mt-2 text-gray-200 whitespace-pre-line">{article.contenu}</p>

          {/* Date */}
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
    </WhiteBackground> <Footer/> </div>
  );
};

export default ArticleDetail;
