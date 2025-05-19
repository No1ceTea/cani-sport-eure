"use client"; // Indique que ce composant s'exécute côté client

import { useEffect, useState } from "react"; // Hooks React pour l'état et les effets
import { useParams, useRouter } from "next/navigation"; // Hook pour accéder aux paramètres d'URL
import supabase from "../../../lib/supabaseClient"; // Client Supabase pour la base de données
import { formatDistanceToNow } from "date-fns"; // Fonction pour calculer le temps relatif
import { fr } from "date-fns/locale"; // Localisation française pour les dates
import WhiteBackground from "@/app/components/backgrounds/WhiteBackground"; // Composant pour le fond blanc
import Footer from "@/app/components/sidebars/Footer"; // Composant de pied de page
import Sidebar from "@/app/components/sidebars/Sidebar"; // Barre latérale de navigation
import Image from "next/image"; // Composant d'image optimisé de Next.js
import Head from "next/head"; // Composant pour gérer les balises <head>

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
  const router = useRouter(); // Hook pour la navigation
  const [article, setArticle] = useState<Article | null>(null); // État pour l'article
  const [author, setAuthor] = useState<Author | null>(null); // État pour l'auteur
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]); // État pour les articles connexes
  const [isLoading, setIsLoading] = useState(true); // État de chargement

  // Effet pour charger les données de l'article et de l'auteur
  useEffect(() => {
    // Fonction pour récupérer l'article par son ID
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true); // Démarrer le chargement

      try {
        // Requête à Supabase pour récupérer l'article
        const { data, error } = await supabase
          .from("publication")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setArticle(data as Article);
        
        // Récupérer l'auteur
        if (data.id_profil) {
          const { data: authorData } = await supabase
            .from("profils")
            .select("nom, prenom, photo_profil")
            .eq("id", data.id_profil)
            .single();
            
          setAuthor(authorData);
        }
        
        // Récupérer des articles similaires (excluant l'article actuel)
        const { data: relatedData } = await supabase
          .from("publication")
          .select("*")
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(3);
          
        setRelatedArticles(relatedData as Article[]);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false); // Fin du chargement
      }
    };

    fetchArticle(); // Exécution du chargement de l'article
  }, [id]); // Rechargement si l'ID change

  // Affichage d'un indicateur de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Affichage d'un message si l'article n'est pas trouvé
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Article non trouvé</h1>
        <p className="text-gray-600 mb-6">L&apos;article que vous cherchez n&apos;existe pas ou a été supprimé.</p>
        <button 
          onClick={() => router.push('/articles')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retourner à la liste des articles
        </button>
      </div>
    );
  }

  // Calcul du temps écoulé depuis la publication (ex: "il y a 2 jours")
  const timeAgo = formatDistanceToNow(new Date(article.created_at), {
    locale: fr,
    addSuffix: true,
  });

  // Ajoutez cette fonction pour générer la table des matières
  const TableOfContents = ({ content }: { content: string }) => {
    // Cette fonction simple extrait les titres basés sur des lignes qui semblent être des titres
    // Dans un cas réel, vous auriez besoin d'un parseur Markdown ou HTML plus robuste
    
    const [isOpen, setIsOpen] = useState(false); // Pour mobile
    
    // Fonction pour extraire les titres et créer des ancres
    const extractHeadings = () => {
      // Diviser le contenu en lignes
      const lines = content.split('\n');
      
      // Trouver les lignes qui ressemblent à des titres (courtes, se terminent par :, etc.)
      const headings = lines
        .filter(line => {
          const trimmed = line.trim();
          // Critères simples pour identifier un titre potentiel
          return (
            // Moins de 100 caractères
            trimmed.length > 0 && 
            trimmed.length < 100 &&
            // Se termine par : ou est en majuscules
            (trimmed.endsWith(':') || 
             trimmed === trimmed.toUpperCase() && trimmed.length > 10) ||
             // Ou commence par plusieurs # (style Markdown)
             /^#{1,3} /.test(trimmed)
          );
        })
        .map((heading, index) => {
          // Créer un ID unique pour l'ancre
          const id = `section-${index}`;
          return { id, text: heading.trim().replace(/^#{1,3} /, '') };
        });
      
      return headings;
    };
    
    const headings = extractHeadings();
    
    // Ne pas afficher si moins de 3 sections
    if (headings.length < 3) return null;
    
    return (
      <>
        {/* Version desktop (latérale) */}
        <div className="hidden lg:block sticky top-6 w-64 ml-6 bg-gray-50 p-4 rounded-lg self-start">
          <h2 className="font-bold text-gray-800 mb-3">Table des matières</h2>
          <div className="space-y-2">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {heading.text.length > 45 
                  ? `${heading.text.substring(0, 45)}...` 
                  : heading.text}
              </a>
            ))}
          </div>
        </div>
        
        {/* Version mobile (en accordéon) */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-lg"
          >
            <span className="font-medium">Table des matières</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="bg-gray-50 p-3 rounded-b-lg border-t border-gray-200 space-y-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {heading.text.length > 35 
                    ? `${heading.text.substring(0, 35)}...` 
                    : heading.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{article.titre} - Cani-Sport Eure</title>
        <meta name="description" content={article.contenu.substring(0, 160)} />
        <meta property="og:title" content={article.titre} />
        <meta property="og:description" content={article.contenu.substring(0, 160)} />
        <meta property="og:image" content={article.image_url} />
      </Head>

      <div className="bg-gray-50">
        <WhiteBackground>
          <Sidebar />
          
          <div className="min-h-screen pt-6 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Barre de navigation */}
            <div className="max-w-6xl mx-auto mb-6">
              <a href="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour aux articles
              </a>
            </div>
            
            {/* Mise en page avec table des matières sur le côté (écrans larges) */}
            <div className="max-w-6xl mx-auto">
              <div className="lg:flex">
                <div className="lg:flex-1">
                  {/* Article principal */}
                  <article className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Image principale et titre (code existant) */}
                    <div className="w-full h-[300px] sm:h-[400px] relative">
                      <Image
                        src={article.image_url}
                        alt={article.titre}
                        className="w-full h-full object-cover"
                        width={1200}
                        height={800}
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{article.titre}</h1>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 md:p-8">
                      {/* Infos auteur et date */}
                      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                        <Image
                          src={author?.photo_profil || "/default-avatar.png"}
                          alt={author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}
                          className="w-12 h-12 rounded-full border border-gray-200"
                          width={48}
                          height={48}
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {author ? `${author.prenom} ${author.nom}` : "Auteur inconnu"}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{timeAgo}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(article.created_at).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                        
                        <div className="ml-auto flex space-x-2">
                          <button 
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Partager"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Table des matières (mobile) */}
                      <TableOfContents content={article.contenu} />
                      
                      {/* Boutons de partage */}
                      <div className="flex space-x-4 mb-6">
                        <a 
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          aria-label="Partager sur Facebook"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.325v21.35C0 23.404.596 24 1.325 24h11.494v-9.294H9.691V12h3.128c.391-2.834 2.451-4.978 5.091-4.978 1.446 0 2.748.529 3.765 1.398.227.197.43.415.615.646.173.213.327.44.46.675.113.203.215.413.293.628.073.204.134.415.174.628.034.173.057.348.057.525v2.293h-4.812c-.391 0-.708.317-.708.708v3.582c0 .391.317.708.708.708h4.812v9.294h4.812V12h3.128c.391 0 .708-.317.708-.708v-3.582c0-.391-.317-.708-.708-.708h-3.128V4.293c0-1.173.195-2.293.577-3.325C22.078.596 22.675 0 23.404 0h.271c.729 0 1.326.596 1.326 1.325v21.35c0 .729-.597 1.325-1.326 1.325h-.271c-.729 0-1.326-.596-1.326-1.325v-9.294h-4.812v9.294h-4.812v-9.294H9.691v9.294H5.879v-9.294H1.325C.596 12 0 11.404 0 10.675V1.325C0 .596.596 0 1.325 0h21.35c.729 0 1.325.596 1.325 1.325v21.35c0 .729-.596 1.325-1.325 1.325h-21.35C.596 24 0 23.404 0 22.675V1.325C0 .596.596 0 1.325 0h21.35z" />
                          </svg>
                          Partager sur Facebook
                        </a>
                        <a 
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.titre)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                          aria-label="Partager sur Twitter"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.643 4.937c-.835.392-1.732.656-2.675.775a4.686 4.686 0 002.043-2.573 9.354 9.354 0 01-2.977 1.134A4.659 4.659 0 0016.337 3c-2.573 0-4.658 2.085-4.658 4.658 0 .365.041.719.122 1.061-3.872-.194-7.303-2.051-9.605-4.867a4.646 4.646 0 00-.628 2.337c0 1.617.823 3.057 2.073 3.895a4.617 4.617 0 01-2.107-.582v.059c0 2.247 1.596 4.115 3.719 4.54a4.645 4.645 0 01-2.103.08 4.66 4.66 0 004.348 3.233A9.354 9.354 0 012.5 18.54a13.186 13.186 0 007.29 2.146c8.748 0 13.548-7.25 13.548-13.548 0-.207 0-.413-.014-.619a9.688 9.688 0 002.385-2.465z" />
                          </svg>
                          Partager sur Twitter
                        </a>
                      </div>
                      
                      {/* Contenu */}
                      <div className="prose prose-lg max-w-none">
                        {/* Contenu formaté avec des ancres pour la table des matières */}
                        {article.contenu.split('\n').map((paragraph, index) => {
                          const trimmed = paragraph.trim();
                          const isHeading = (
                            trimmed.length > 0 && 
                            trimmed.length < 100 &&
                            (trimmed.endsWith(':') || 
                             trimmed === trimmed.toUpperCase() && trimmed.length > 10 ||
                             /^#{1,3} /.test(trimmed))
                          );
                          
                          if (isHeading) {
                            // C'est un titre, ajoutons une ancre
                            const headingId = `section-${index}`;
                            const cleanHeading = trimmed.replace(/^#{1,3} /, '');
                            
                            return (
                              <h3 key={index} id={headingId} className="text-xl font-bold mt-6 mb-4 scroll-mt-24">
                                {cleanHeading}
                              </h3>
                            );
                          } else if (trimmed.length > 0) {
                            // C'est un paragraphe normal
                            return (
                              <p key={index} className="mb-4 whitespace-pre-line leading-relaxed text-gray-700">
                                {paragraph}
                              </p>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </div>
                  </article>
                </div>
                
                {/* Table des matières (desktop) */}
                <TableOfContents content={article.contenu} />
              </div>
            </div>
            
            {/* Articles connexes */}
            {relatedArticles.length > 0 && (
              <div className="max-w-6xl mx-auto mt-12 px-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">À lire également</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map(relArticle => (
                    <a 
                      key={relArticle.id} 
                      href={`/articles/${relArticle.id}`} 
                      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 relative">
                        <Image 
                          src={relArticle.image_url} 
                          alt={relArticle.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={300}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                          {relArticle.titre}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(relArticle.created_at), { 
                            locale: fr, 
                            addSuffix: true 
                          })}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </WhiteBackground>
        <Footer />
      </div>
    </>
  );
};

export default ArticleDetail;
