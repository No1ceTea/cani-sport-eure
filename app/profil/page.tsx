"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL ou Anon Key manquants.");
    // Vous pouvez arrêter l'exécution ici si nécessaire
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

interface Profile {
    nom: string;
    prenom: string;
    age: number;
    email: string;
    dateNaissance: string;
    dateRenouvellement: string;
    license: string;
    photoUrl: string;
}

interface ProfilePageProps {
    userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
    const [profile, setProfile] = useState<Profile>({
        nom: "",
        prenom: "",
        age: 0,
        email: "",
        dateNaissance: "1970-01-01",  // Date par défaut valide
        dateRenouvellement: "1970-01-01",  // Date par défaut valide
        license: "",
        photoUrl: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();
                
                if (error) throw error;
                setProfile(data);
            } catch (error) {
                console.error("Erreur lors du chargement du profil", error);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setPhotoPreview(previewUrl);  // Prévisualisation de l'image
        }
    };

    const uploadPhoto = async () => {
        if (!file) return;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const { error } = await supabase.storage
            .from("avatars")
            .upload(fileName, file, { upsert: true });

        if (error) {
            console.error("Erreur lors de l'upload de l'image", error);
            return;
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        setProfile(prevState => ({ ...prevState, photoUrl: urlData.publicUrl }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file) await uploadPhoto();
        try {
            const { error } = await supabase
                .from("profiles")
                .update(profile)
                .eq("id", userId);
            
            if (error) throw error;
            setNotification("Profil mis à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
            setNotification("Erreur lors de la mise à jour du profil.");
        }
    };

    return (
        <div className="profile-container">
            {notification && <div className="notification">{notification}</div>}
            <h2 className="profile-title">Profil</h2>
            <div className="profile-card">
                {photoPreview && <img src={photoPreview} alt="Prévisualisation" className="preview-photo" />}
                <input type="file" onChange={handleFileChange} className="file-input" />
                <form onSubmit={handleSubmit} className="profile-form">
                    <input type="text" name="nom" value={profile.nom} onChange={handleChange} placeholder="Nom" className="input-field" />
                    <input type="text" name="prenom" value={profile.prenom} onChange={handleChange} placeholder="Prénom" className="input-field" />
                    <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Âge" className="input-field" />
                    <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="input-field" />
                    <input type="date" name="dateNaissance" value={profile.dateNaissance} onChange={handleChange} className="input-field" />
                    <input type="date" name="dateRenouvellement" value={profile.dateRenouvellement} onChange={handleChange} className="input-field" />
                    <input type="text" name="license" value={profile.license} onChange={handleChange} placeholder="License" className="input-field" />
                    <button type="submit" className="save-button">Enregistrer les modifications</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
